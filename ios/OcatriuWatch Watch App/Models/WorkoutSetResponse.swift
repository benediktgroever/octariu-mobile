//
//  WorkoutSetResponse.swift
//  OcatriuWatch Watch App
//
//  Created by Benedikt Groever on 12/5/23.
//

import Foundation

// Define the WorkoutSetResponse structure using dictionaries
struct WorkoutSetResponse: Encodable, Decodable {
  var workouts: [String: [Workout]]
  var sets: [String: [Set]]
}

struct ExerciseResponse: Decodable {
  var exercises: [Exercise]
}
