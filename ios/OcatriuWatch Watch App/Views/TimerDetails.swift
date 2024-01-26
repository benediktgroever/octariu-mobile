//
//  Timer.swift
//  OcatriuWatch Watch App
//
//  Created by Benedikt Groever on 1/17/24.
//

import SwiftUI
import Combine
import Foundation

struct TimerDetails: View {
  @EnvironmentObject var heartRateService: HeartRateService
  @EnvironmentObject var data_service: DataService
  @State private var progress: CGFloat = 1.0
  @State private var timeRemaining: CGFloat
  @State private var timer = Timer.publish(every: 0.1, on: RunLoop.main, in: RunLoop.Mode.common).autoconnect()
  let stopCountdownTimestamp: TimeInterval
  var exercise: Exercise
  var set: Set
  var count_sets: Int

  init(stopTimestamp: TimeInterval, workout_rank_item: WorkoutRankItem, set: Set) {
    let currentTime = Date().timeIntervalSince1970
    let remainingTime = max(stopTimestamp - currentTime, 0)
    _timeRemaining = State(initialValue: CGFloat(remainingTime))
    stopCountdownTimestamp = stopTimestamp
    self.count_sets = workout_rank_item.sets.count
    self.exercise = workout_rank_item.exercise
    self.set = set
  }
  
  var body: some View {
    VStack {
      HStack {
        Button(action: {
          data_service.countDownEndTime = nil;
        }){
          VStack{
            Text("Skip")
              .font(.caption)
              .foregroundColor(.white)
          }
        }
        .frame(minWidth: 0, maxWidth: .infinity, alignment: .leading)
        .background(Color.black)
        .cornerRadius(3)
        .controlSize(.mini)
        Spacer()
        HStack{
          Image(systemName: "heart.fill")
              .foregroundColor(.red)
          Text(String(format: "%.1f", heartRateService.lastHeartRate))
              .font(.footnote)
        }
        .frame(minWidth: 0, maxWidth: .infinity, alignment: .trailing)
      }
      ZStack {
          Circle()
              .trim(from: 0, to: progress)
              .stroke(style: StrokeStyle(lineWidth: 10, lineCap: .round, lineJoin: .round))
              .foregroundColor(.blue)
              .rotationEffect(Angle(degrees: -90))
              .animation(.linear, value: progress)
              .padding(15)
          Text("\(Int(timeRemaining))s")
              .font(.footnote)
              .frame(maxWidth: .infinity, maxHeight: .infinity)
      }
      VStack(alignment: .leading) {
        HStack{
          Text("Next: " + String(self.exercise.name))
            .font(.footnote)
          Spacer()
        }
        Text("set \(self.set.exerciseRank) of \(self.count_sets)")
          .font(.footnote)
      }
    }
    .onReceive(timer) { _ in
        let currentTime = Date().timeIntervalSince1970
        let remainingTime = max(self.stopCountdownTimestamp - currentTime, 0)
        
        if remainingTime > 0 {
            self.timeRemaining = CGFloat(remainingTime)
            self.progress = self.timeRemaining / 120
            self.heartRateService.fetchLatestHeartRate()
        } else {
            self.timer.upstream.connect().cancel()
            data_service.countDownEndTime = nil
        }
    }
    .padding(15)
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .edgesIgnoringSafeArea(.all)
  }
}

// Preview
struct TimerDetails_Previews: PreviewProvider {
    static var previews: some View {
        let futureTime = Date().addingTimeInterval(120).timeIntervalSince1970 // 120 seconds from now
        return TimerDetails(stopTimestamp: futureTime, workout_rank_item: WorkoutRankItem(workoutRank: "abcd", exercise: Exercise(createdAtMs: 0, equipment: "", exerciseId: "", muscleGroup: "", name: "Incline Bench press (Dumbbell)", updatedAtMs: 0), sets: [Set(completedAtMs: 0, createdAtMs: 0, exerciseId: "", exerciseRank: 1, repCount: 12, setId: "", template: false, user: "", weight: 125.5, workoutId: "", workoutRank: "abcd")]), set: Set(completedAtMs: 0, createdAtMs: 0, exerciseId: "", exerciseRank: 1, repCount: 12, setId: "setId", template: false, user: "", weight: 125.5, workoutId: "", workoutRank: "abcd"))
            .environmentObject(HeartRateService())
    }
}
