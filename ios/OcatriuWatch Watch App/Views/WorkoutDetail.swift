//
//  WorkoutRankListItem.swift
//  OcatriuWatch Watch App
//
//  Created by Benedikt Groever on 12/7/23.
//

import Foundation
import SwiftUI

struct WorkoutDetailHeader: View {
  var workout: Workout
  var startTimeS: TimeInterval
  @State private var currentTimeS: TimeInterval
  
  init(workout: Workout) {
    self.startTimeS = TimeInterval(workout.startTimeMs) / 1000.0
    self.currentTimeS = Date().timeIntervalSince1970
    self.workout = workout
  }

  var body: some View {
    let elapsedTime = Int(currentTimeS - startTimeS)
    let timeComponents = millisecondsToHoursMinutesSeconds(seconds: elapsedTime)
    let hours = timeComponents.hours
    let minutes = timeComponents.minutes
    let seconds = timeComponents.seconds
    var timeString: String = ""
    if hours > 0 {
        timeString += "\(hours)h "
    }
    if minutes > 0 {
        timeString += "\(minutes)m "
    }
    timeString += "\(seconds)s"
    return VStack{
      HStack{
        Text(workout.name)
          .font(.title2)
          .multilineTextAlignment(.leading)
        Spacer()
      }
      HStack{
        Text(timeString)
          .foregroundColor(Color.red)
          .multilineTextAlignment(.leading)
            .onAppear {
                startTimer()
            }
        Spacer()
      }
    }
  }

  func startTimer() {
      Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { timer in
        currentTimeS = Date().timeIntervalSince1970
      }
  }

  func millisecondsToHoursMinutesSeconds(seconds: Int) -> (hours: Int, minutes: Int, seconds: Int) {
      let hours = seconds / 3600
      let minutes = (seconds % 3600) / 60
      let remainingSeconds = (seconds % 3600) % 60
      return (hours, minutes, remainingSeconds)
  }
}

struct CancelWorkoutButton: View {
  @EnvironmentObject var data_service: DataService
    var body: some View {
        Button(action: {
          if let workoutId = self.data_service.activeWorkout?.workoutId {
            self.data_service.workoutService.delete_workout(
              workoutId: workoutId
            )
            self.data_service.activeWorkout = nil
            self.data_service.setService.sets = []
          }
        }) {
            HStack {
              Text("Cancel")
            }
        }
    }
}

struct FinishWorkoutButton: View {
  @EnvironmentObject var data_service: DataService
    var body: some View {
        Button(action: {
          if let workoutId = self.data_service.activeWorkout?.workoutId {
            self.data_service.workoutService.update_workout(
              workoutId: workoutId,
              endTimeMs: Int(Date().timeIntervalSince1970) * 1000
            )
            self.data_service.activeWorkout = nil
            self.data_service.setService.sets = []
          }
        }) {
            HStack {
              Text("Finish")
            }
        }
    }
}

struct SetListItem: View {
  var set: Set
  @EnvironmentObject var data_service: DataService
  
    var body: some View {
      let rounded = Float(Int(set.weight * 2)) * 0.5
      ZStack {
        // Background color extending to the full screen
        (set.completedAtMs == 0 ? Color(red: 0.212, green: 0.184, blue: 0.200) : Color(red: 0.212, green: 0.254, blue: 0.200))
        
          .edgesIgnoringSafeArea(.all)
        VStack {
          Text(set.weight.truncatingRemainder(dividingBy: 1) == 0
               ? "\(Int(set.weight)) lbs x \(set.repCount)"
               : "\(rounded, specifier: "%.1f") lbs x \(set.repCount)"
          )
            .font(.footnote)
            .padding(5)
            .foregroundColor(Color.white)
            .cornerRadius(0)
            .frame(maxWidth: .infinity, alignment: .leading)
            .onTapGesture {
              data_service.displaySetId = set.setId
              data_service.lastWorkoutRankIDViewed = set.workoutRank
            }
        }
      }
    }
}

struct WorkoutRankItemView: View {
  var workout_rank: WorkoutRankItem

  var body: some View {
      VStack{
          ZStack {
              // Background color extending to the full screen
            Color(red: 0.112, green: 0.104, blue: 0.100)
                  .edgesIgnoringSafeArea(.all) // Extend the color to the edges of the display

            VStack{
              Text(workout_rank.exercise.name)
                  .font(.footnote)
                  .padding(.vertical, 5)
            }
          }
          ForEach(workout_rank.sets) { set in
            SetListItem(set: set)
          }
        }
        .padding(.top, 10) // Adjust as needed
  }
}


struct WorkoutDetail: View {
  @EnvironmentObject var data_service: DataService
  @State private var lastScrollPosition: String?

  var body: some View {
    ScrollViewReader { value in
      ScrollView {
        WorkoutDetailHeader(workout: data_service.activeWorkout ?? Workout(createdAtMs: 0, endTimeMs: 0, name: "", repIntensity: 1.0, startTimeMs: 0, template: false, user: "", weightIntensity: 1.0, workoutId: "", workoutParentId: "", workoutPlanId: "", workoutRanksOrder: [""]))
        LazyVStack(alignment: .leading) {
          ForEach(data_service.activeWorkout?.workoutRanksOrder ?? [], id: \.self) { workout_rank in
            if let workoutRankItem = data_service.workoutRankItems[workout_rank] {
              WorkoutRankItemView(workout_rank: workoutRankItem)
            }
          }
        }
        .padding()
        FinishWorkoutButton()
        CancelWorkoutButton()
      }
      .onAppear {
        // Scroll to the last known position when the view appears
        if let lastWorkoutRankIDViewed = data_service.lastWorkoutRankIDViewed {
          value.scrollTo(lastWorkoutRankIDViewed, anchor: .top)
        }
      }
    }
  }
}

#Preview {
  WorkoutDetail()
    .environmentObject(DataService())
}
