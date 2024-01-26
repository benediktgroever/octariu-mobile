//
//  Exercise.swift
//  OcatriuWatch Watch App
//
//  Created by Benedikt Groever on 12/7/23.
//

import Foundation

struct Exercise: Hashable, Codable, Identifiable {
  var id: String { exerciseId }
  var createdAtMs: Int
  var equipment: String
  var exerciseId: String
  var muscleGroup: String
  var name: String
  var updatedAtMs: Int
}
