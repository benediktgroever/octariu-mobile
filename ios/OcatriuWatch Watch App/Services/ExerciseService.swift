//
//  ExerciseService.swift
//  OcatriuWatch Watch App
//
//  Created by Benedikt Groever on 12/21/23.
//

import Foundation
import Combine

class ExerciseService: ObservableObject {
  let apiservice: APIService = APIService(endpoint: "")
  @Published var exerciseHashMap: [String:Exercise] = [:]
        
  func fetch_all_exercises(){
    let exercisesParams: [String: String] = [:]
    Task {
        var exerciseHashMap: [String:Exercise] = [:]
        let exercises = await self.make_an_exercise_api_call(endpoint: "/exercises/list", method: "GET", params: exercisesParams).exercises
        for exercise in exercises {
          exerciseHashMap[exercise.exerciseId] = exercise
        }
        DispatchQueue.main.async {
          [exerciseHashMap] in
              self.exerciseHashMap = exerciseHashMap
        }
    }
  }
    
  func make_an_exercise_api_call(endpoint: String, method: String, params: [AnyHashable: Any]) async -> ExerciseResponse {
    let default_value = ExerciseResponse(
      exercises: []
    )
    do {
      guard let data = try await self.apiservice.make_api_call(endpoint: endpoint, method: method, params: params) else {
          return default_value
        }
        let decoder = JSONDecoder()
        let decodedResponse = try decoder.decode(ExerciseResponse.self, from: data)
        return decodedResponse
    } catch {
        print("Error fetching data: \(error)")
        return default_value
    }
  }
}
