//
//  SetListItem.swift
//  OcatriuWatch Watch App
//
//  Created by Benedikt Groever on 12/7/23.
//

import Foundation
import SwiftUI

struct SetDetails: View {
  var exercise: Exercise
  var set: Set
  var count_sets: Int
  @EnvironmentObject var data_service: DataService

  
  init(workout_rank_item: WorkoutRankItem, set: Set) {
    self.count_sets = workout_rank_item.sets.count
    self.exercise = workout_rank_item.exercise
    self.set = set
  }
  
    var body: some View {
      let rep_selection = Binding(
        get: { self.set.repCount },
        set: { newValue in
          self.data_service.setService.update_set(
            setId: set.setId,
            completedTimeMs: nil,
            weight: nil,
            repCount: newValue
          )
        }
      )
      let weight_selection = Binding(
        get: { Int(self.set.weight * 2) },
        set: { newValue in
          self.data_service.setService.update_set(
            setId: set.setId,
            completedTimeMs: nil,
            weight: Float(newValue) * 0.5,
            repCount: nil
          )
        }
      )
      VStack(alignment: .center){
        HStack {
          Button(action: {
            data_service.displaySetId = nil;
          }){
            VStack{
              Image(systemName: "xmark")
                  .font(.title3)
                  .foregroundColor(.white)
            }
          }
          .frame(minWidth: 0, maxWidth: 50, alignment: .center)
          .background(Color.black)
          .cornerRadius(0)
          .controlSize(.mini)
          .padding(.leading, 5)
          Spacer()
        }
        VStack(alignment: .leading) {
          HStack{
            Text(String(self.exercise.name))
              .font(.subheadline)
            Spacer()
          }
          Text("set \(self.set.exerciseRank) of \(self.count_sets)")
            .font(.footnote)
        }
        HStack {
          VStack {
            Text("Weight").font(.footnote)
            Picker("Weight", selection: weight_selection) {
                ForEach(0 ..< 1001, id: \.self) { number in
                  let floatValue = Float(number) * 0.5
                  // Check if the number is a whole number or a half number
                  Text(floatValue.truncatingRemainder(dividingBy: 1) == 0
                       ? "\(Int(floatValue))"
                       : "\(floatValue, specifier: "%.1f")"
                  ).tag(number)
                }
            }
            .pickerStyle(.wheel)
            .frame(height: 45)
            .clipped()
            .font(.headline)
            .labelsHidden()
          }
          VStack {
            Text("Reps").font(.footnote)
            Picker("Reps", selection: rep_selection) {
                ForEach(1...100, id: \.self) { number in
                    Text("\(number)")
                }
            }
            .pickerStyle(.wheel)
            .frame(height: 45)
            .clipped()
            .font(.headline)
            .labelsHidden()
          }
        }
        HStack {
          Button(action: {
              // Action for the button
            data_service.previousSet()
          }){
            VStack{
              Text("Prior")
                .font(.footnote)
              Image(systemName: "arrow.left")
                  .font(.title3)
                  .foregroundColor(.white)
            }
          }
          .background(Color(red: 0.4627, green: 0.8392, blue: 1.0))
          .cornerRadius(10)
          .controlSize(.mini)
          .padding(3)
          Button(action: {
            if(set.completedAtMs == 0){
              data_service.nextSet()
              data_service.countDownEndTime = data_service.displaySetId != nil ? Date().addingTimeInterval(120).timeIntervalSince1970 : nil
            }
            data_service.setService.update_set(
              setId: set.setId,
              completedTimeMs: set.completedAtMs == 0 ? Int(Date().timeIntervalSince1970) * 1000 : 0,
              weight: nil,
              repCount: nil
            )
          }){
            VStack{
              Text("Mark")
                .font(.footnote)
              Text(set.completedAtMs == 0 ? "done" : "to do")
                .font(.footnote)
            }
          }
          .background(set.completedAtMs == 0 ? Color.green : Color(red: 0.8627, green: 0.3392, blue: 0.2))
          .cornerRadius(10)
          .controlSize(.mini)
          .padding(3)
          Button(action: {
            data_service.nextSet()
          }){
            VStack{
              Text("Next")
                .font(.footnote)
              Image(systemName: "arrow.right")
                  .font(.title3)
                  .foregroundColor(.white)
            }
          }
          .background(Color.green)
          .cornerRadius(10)
          .controlSize(.mini)
          .padding(3)
        }
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity)
      .edgesIgnoringSafeArea(.all)
      .padding(2)
    }
}

#Preview {
  SetDetails(workout_rank_item: WorkoutRankItem(workoutRank: "abcd", exercise: Exercise(createdAtMs: 0, equipment: "", exerciseId: "", muscleGroup: "", name: "Incline Bench press", updatedAtMs: 0), sets: [Set(completedAtMs: 0, createdAtMs: 0, exerciseId: "", exerciseRank: 1, repCount: 12, setId: "", template: false, user: "", weight: 125.5, workoutId: "", workoutRank: "abcd")]), set: Set(completedAtMs: 0, createdAtMs: 0, exerciseId: "", exerciseRank: 1, repCount: 12, setId: "setId", template: false, user: "", weight: 125.5, workoutId: "", workoutRank: "abcd"))
}
