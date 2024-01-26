//
//  ContentView.swift
//  OcatriuWatch Watch App
//
//  Created by Benedikt Groever on 12/3/23.
//

import SwiftUI

struct ContentView: View {
  @ObservedObject var data_service = DataService()
  @StateObject private var heartRateService = HeartRateService()
  @Environment(\.scenePhase) var scenePhase
  var body: some View {
    if data_service.activeWorkout == nil {
      WorkoutSelectionView()
        .environmentObject(data_service)
        .onChange(of: scenePhase) { oldScenePhase, newScenePhase in
          if newScenePhase == .active{
            self.data_service.fetch_all()
          }
        }
    }else if(heartRateService.authorizationStatus == .notDetermined){
        RequestPermissionsView()
    }else if let countDownEndTime = data_service.countDownEndTime, let setId = data_service.displaySetId{
      if let set = data_service.setService.get_set(setId: setId),
         let workoutRankItem = data_service.workoutRankItems[set.workoutRank] {
        TimerDetails(stopTimestamp: countDownEndTime, workout_rank_item: workoutRankItem, set: set)
          .environmentObject(data_service)
          .environmentObject(heartRateService)
      }
    }else if let setId = data_service.displaySetId{
      if let set = data_service.setService.get_set(setId: setId),
         let workoutRankItem = data_service.workoutRankItems[set.workoutRank] {
        SetDetails(workout_rank_item: workoutRankItem, set: set)
          .environmentObject(data_service)
      }
    }else{
      WorkoutDetail()
        .environmentObject(data_service)
        .onChange(of: scenePhase) { oldScenePhase, newScenePhase in
          if newScenePhase == .active{
            self.data_service.fetch_all()
          }
        }
    }
  }
}

#Preview {
    ContentView()
}
