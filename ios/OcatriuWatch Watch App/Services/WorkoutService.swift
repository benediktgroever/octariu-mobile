//
//  WorkoutService.swift
//  OcatriuWatch Watch App
//
//  Created by Benedikt Groever on 12/5/23.
//

import Foundation
import Combine

class WorkoutService: ObservableObject {
  var phoneConnector: PhoneConnector
  let apiservice: APIService = APIService(endpoint: "")
  @Published var workouts: [Workout]
  weak var delegate: DataServiceDelegate?
  
  init(phoneConnector: PhoneConnector){
    self.phoneConnector = phoneConnector
    self.workouts = []
  }
    
  func update_workout(workoutId: String, endTimeMs: Int?){
    var workoutUpdateParams: [String:Any] = ["workoutId": workoutId]
    if let endTimeMs = endTimeMs {
      workoutUpdateParams["endTimeMs"] = endTimeMs
    }
    Task { [workoutUpdateParams] in
      let response = await self.make_an_api_call(endpoint: "/workouts/update", method: "POST", params: workoutUpdateParams)
      self.phoneConnector.sendMessage(response: response)
      self.delegate?.handleWorkoutSetResponse(didSendData: response)
    }
  }
  
  func delete_workout(workoutId: String){
    let workoutDeleteParams: [String:Any] = ["workoutId": workoutId]
    Task { [workoutDeleteParams] in
      let response = await self.make_an_api_call(endpoint: "/workouts/delete", method: "DELETE", params: workoutDeleteParams)
      guard (response.workouts["deleted"]) != nil else {
        return
      }
      self.phoneConnector.sendMessage(response: response)
      self.delegate?.handleWorkoutSetResponse(didSendData: response)
    }
  }
  
  func create_active_workout_from_template(template: Workout){
    let workoutCreateParms: [String: String] = [
      "copyWorkoutId": template.workoutId,
      "name": template.name,
      "startTimeMs": String(Int(Date().timeIntervalSince1970 * 1000.0)),
      "weightIntensity": "1.0",
      "repIntensity": "1.0",
    ]
    Task {
        let response = await self.make_an_api_call(endpoint: "/workouts/create", method: "POST", params: workoutCreateParms)
        self.phoneConnector.sendMessage(response: response)
        self.delegate?.handleWorkoutSetResponse(didSendData: response)
    }
  }

  func fetch_all_workouts(){
    Task {
      async let workoutData = self.make_an_api_call(endpoint: "/workouts/list", method: "GET", params: [:])
        guard let workouts_list = await workoutData.workouts["list"] else {
          return
        }
        DispatchQueue.main.async {
          [workouts_list] in
          self.workouts = workouts_list
        }
    }
  }
  
  func update_workouts_reducer(updates: [Workout]){
    DispatchQueue.main.async {
      [updates] in
      for index in 0..<self.workouts.count {
        if let matchingWorkout = updates.first(where: { $0.workoutId == self.workouts[index].workoutId }){
          self.workouts[index] = matchingWorkout
        }
      }
    }
  }
  
  func delete_workouts_reducer(deletes: [Workout]){
    DispatchQueue.main.async {
      let idsToRemove = Swift.Set(deletes.map { $0.workoutId })
      self.workouts = self.workouts.filter { !idsToRemove.contains($0.id) }
    }
  }
  
  func create_workouts_reducer(creates: [Workout]){
    DispatchQueue.main.async {
      for element in creates {
        if let index = self.workouts.firstIndex(where: { $0.id == element.id }) {
          // If the element exists, update it
          self.workouts[index] = element
        } else {
          // If the element doesn't exist, add it
          self.workouts.append(element)
        }
      }
    }
  }

  func make_an_api_call(endpoint: String, method: String, params: [AnyHashable: Any]) async -> WorkoutSetResponse {
    let default_value = WorkoutSetResponse(
      workouts: [
          "list": [],
          "created": [],
          "updated": [],
          "deleted": [],
      ],
      sets: [
          "list": [],
          "created": [],
          "updated": [],
          "deleted": [],
      ]
    )
    do {
        guard let data = try await self.apiservice.make_api_call(endpoint: endpoint, method: method, params: params) else {
          return default_value
        }
        let decoder = JSONDecoder()
        let decodedResponse = try decoder.decode(WorkoutSetResponse.self, from: data)
        return decodedResponse
    } catch {
        print("Error fetching data: \(error)")
        return default_value
    }
  }
}
