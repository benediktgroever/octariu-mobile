//
//  Set.swift
//  OcatriuWatch Watch App
//
//  Created by Benedikt Groever on 12/3/23.
//

import Foundation

struct Set: Hashable, Codable, Identifiable {
  var id: String { setId }
  var completedAtMs: Int
  var createdAtMs: Int
  var exerciseId: String
  var exerciseRank: Int
  var repCount: Int
  var setId: String
  var template: Bool
  var user: String
  var weight: Float
  var workoutId: String
  var workoutRank: String
}
