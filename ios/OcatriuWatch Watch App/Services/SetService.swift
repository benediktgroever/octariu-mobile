//
//  SetService.swift
//  OcatriuWatch Watch App
//
//  Created by Benedikt Groever on 12/21/23.
//

import Foundation
import Combine


class SetService: ObservableObject {
  var phoneConnector: PhoneConnector
  let apiservice: APIService = APIService(endpoint: "")
  weak var delegate: DataServiceDelegate?
  var workoutId: String? = nil
  @Published var sets: [Set] = []
  private var throttler = Throttler(delay: 0.5)
  
  init(phoneConnector: PhoneConnector){
    self.phoneConnector = phoneConnector
  }
  
  func get_set(setId: String) -> Set? {
    if let set = self.sets.first(where: { $0.id == setId }) {
      return set
    }
    return nil
  }
  
  func update_set(setId: String, completedTimeMs: Int?, weight: Float?, repCount: Int?){
    var setUpdateParams: [String:Any] = ["setId": setId]
    if let completedTimeMs = completedTimeMs {
      setUpdateParams["completedAtMs"] = completedTimeMs
    }
    if let weight = weight {
      setUpdateParams["weight"] = weight
    }
    if let repCount = repCount {
      setUpdateParams["repCount"] = repCount
    }
    Task { [setUpdateParams] in
      DispatchQueue.main.async {
        if let index = self.sets.firstIndex(where: { $0.id == setId }){
           if let completedAtMs = setUpdateParams["completedAtMs"] as? Int {
            self.sets[index].completedAtMs = completedAtMs
           }
          if let weight = setUpdateParams["weight"] as? Float {
           self.sets[index].weight = weight
          }
          if let repCount = setUpdateParams["repCount"] as? Int {
           self.sets[index].repCount = repCount
          }
        }
      }
    }
    self.throttler.throttle(uuid: Array(setUpdateParams.keys).sorted().joined(separator: "|")) {
      Task { [setUpdateParams] in
        let response = await self.make_an_api_call(endpoint: "/sets/update", method: "POST", params: setUpdateParams)
        guard (response.sets["updated"]) != nil else {
          return
        }
        self.phoneConnector.sendMessage(response: response)
      }
    }
  }
  
  func update_sets_reducer(updates: [Set]){
    DispatchQueue.main.async {
      [updates] in
      for index in 0..<self.sets.count {
        if let matchingSet = updates.first(where: { $0.setId == self.sets[index].setId }){
          self.sets[index] = matchingSet
        }
      }
    }
  }
  
  func delete_sets_reducer(deletes: [Set]){
    DispatchQueue.main.async {
      let idsToRemove = Swift.Set(deletes.map { $0.setId })
      self.sets = self.sets.filter { !idsToRemove.contains($0.id) }
    }
  }
  
  func create_sets_reducer(creates: [Set]){
    DispatchQueue.main.async {
      for element in creates {
        if let index = self.sets.firstIndex(where: { $0.id == element.id }) {
          // If the element exists, update it
          self.sets[index] = element
        } else {
          // If the element doesn't exist, add it
          self.sets.append(element)
        }
      }
    }
  }

  func fetch_all_sets(){
    Task {
        async let setsData = self.make_an_api_call(endpoint: "/sets/list", method: "GET", params: [:])
        let data_sets = await setsData.sets["list"]!
        DispatchQueue.main.async {
          [data_sets] in
              self.sets = data_sets
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
