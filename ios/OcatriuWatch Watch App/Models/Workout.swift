//
//  Workout.swift
//  OcatriuWatch Watch App
//
//  Created by Benedikt Groever on 12/3/23.
//

import Foundation

struct Workout: Hashable, Codable, Identifiable {
  var id: String { workoutId }
  var createdAtMs: Int
  var endTimeMs: Int
  var name: String
  var repIntensity: Float
  var startTimeMs: Int
  var template: Bool
  var user: String
  var weightIntensity: Float
  var workoutId: String
  var workoutParentId: String
  var workoutPlanId: String
  var workoutRanksOrder: Array<String>
}

struct WorkoutTemplateViewItem: Hashable, Codable, Identifiable {
  var id: String { workout.workoutId }
  var workout: Workout
  var lastEndTimeMs: Int
}
