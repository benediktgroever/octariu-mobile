//
//  WorkoutRankService.swift
//  OcatriuWatch Watch App
//
//  Created by Benedikt Groever on 12/21/23.
//

import Foundation
import Combine

struct WorkoutRankItem: Identifiable  {
    var id: String { workoutRank }
    var workoutRank: String
    var exercise: Exercise
    var sets: [Set]
}

protocol DataServiceDelegate: AnyObject {
    func handleWorkoutSetResponse(didSendData response: WorkoutSetResponse)
}

class DataService: ObservableObject, DataServiceDelegate {
  var workoutService: WorkoutService
  var exerciseService: ExerciseService
  var setService: SetService
  var phoneConnector: PhoneConnector
  @Published var workoutRankItems: [String:WorkoutRankItem] = [:]
  @Published var displaySetId: String? = nil
  @Published var countDownEndTime: TimeInterval? = nil
  @Published var activeWorkout: Workout? = nil
  @Published var lastWorkoutRankIDViewed: String? = nil
  @Published var templates: [WorkoutTemplateViewItem] = []
  var cancellables = Swift.Set<AnyCancellable>()
    
  init() {
    self.exerciseService = ExerciseService()
    self.phoneConnector = PhoneConnector()
    self.workoutService = WorkoutService(phoneConnector: self.phoneConnector)
    self.setService = SetService(phoneConnector: self.phoneConnector)
    self.phoneConnector.delegate = self
    self.workoutService.delegate = self
    self.setService.delegate = self
    self.fetch_all()
    setService.$sets
          .combineLatest(exerciseService.$exerciseHashMap, $activeWorkout)
          .map { sets, exerciseHashMap, activeWorkout in
              // Logic to compute WorkoutRankItems
              self.computeWorkoutRankItems(sets: sets, exerciseHashMap: exerciseHashMap, activeWorkout: activeWorkout)
          }
          .assign(to: &$workoutRankItems)
            
    workoutService.$workouts
      .map { workouts in
              // Logic to compute WorkoutRankItems
              let activeWorkout = self.findActiveWorkout(workouts: workouts)
              let templates = self.computeWorkoutTemplates(workouts: workouts)
              return (activeWorkout, templates)
          }
          .sink { [weak self] activeWorkout, templates in
              self?.templates = templates
              self?.activeWorkout = activeWorkout
          }
          .store(in: &cancellables)
  }
  
  func handleWorkoutSetResponse(didSendData response: WorkoutSetResponse) -> Void{
    self.setService.create_sets_reducer(creates: response.sets["created"] ?? [])
    self.setService.delete_sets_reducer(deletes: response.sets["deleted"] ?? [])
    self.setService.update_sets_reducer(updates: response.sets["updated"] ?? [])
    self.workoutService.create_workouts_reducer(creates: response.workouts["created"] ?? [])
    self.workoutService.update_workouts_reducer(updates: response.workouts["updated"] ?? [])
    self.workoutService.delete_workouts_reducer(deletes: response.workouts["deleted"] ?? [])
  }
  
  func fetch_all() -> Void {
    self.workoutService.fetch_all_workouts()
    self.exerciseService.fetch_all_exercises()
    self.setService.fetch_all_sets()
  }
  
  private func computeWorkoutTemplates(workouts: [Workout]) -> [WorkoutTemplateViewItem] {
    var lastEndTimeMsDict = [String:Int]()
    for workout in workouts {
      lastEndTimeMsDict[workout.workoutParentId] = max(lastEndTimeMsDict[workout.workoutParentId] ?? 0, workout.endTimeMs)
    }    
    return workouts
      .filter {$0.template == true}
      .map { WorkoutTemplateViewItem(workout: $0, lastEndTimeMs: lastEndTimeMsDict[$0.workoutId] ?? 0)}
      .sorted { $0.lastEndTimeMs > $1.lastEndTimeMs }
  }
   
  private func findActiveWorkout(workouts: [Workout]) -> Workout? {
    return workouts.first(where: { $0.startTimeMs != 0 && $0.template == false && $0.endTimeMs == 0 })
  }

  private func computeWorkoutRankItems(sets: [Set], exerciseHashMap: [String:Exercise], activeWorkout: Workout?) -> [String:WorkoutRankItem] {
    if(activeWorkout == nil){
      // Sets, exercises and active workout need to be there
      // else terminate execution
      return [:]
    }
    if(sets.count == 0){
      return [:]
    }
    if(exerciseHashMap.isEmpty){
      return [:]
    }
    var sortedWorkoutSets = [String: [Set]]()
    var workoutRankItems: [String:WorkoutRankItem] = [:]
    for set in sets {
      if (activeWorkout!.workoutId == set.workoutId){
        sortedWorkoutSets[set.workoutRank, default: []].append(set)
      }
    }
    for key in sortedWorkoutSets.keys {
        // sort sets by exercise rank
        sortedWorkoutSets[key]?.sort(by: { $0.exerciseRank < $1.exerciseRank })
        let workout_rank_sets = sortedWorkoutSets[key]!
        let workout_rank = WorkoutRankItem(
          workoutRank: workout_rank_sets[0].workoutRank,
          exercise: exerciseHashMap[workout_rank_sets[0].exerciseId]!,
          sets: workout_rank_sets
        )
        workoutRankItems[workout_rank.id] = workout_rank
    }
    return workoutRankItems
  }
  
  func previousSet(){
    
    // Early return if displaySetId is nil
    guard let displaySetId = self.displaySetId else { return }

    // Get the set and return early if nil
    guard let set = setService.get_set(setId: displaySetId) else {
        self.displaySetId = nil
        return
    }

    // Check if the workoutRank exists and return the next set within the workoutRank if it exists
    if let workoutRank = workoutRankItems[set.workoutRank],
       let nextSet = workoutRank.sets.first(where: { $0.exerciseRank == set.exerciseRank - 1 }) {
        self.displaySetId = nextSet.setId
        return
    }

    // Check if the active workout exists and if it is included in the current workoutRank
    guard let activeWorkout = self.activeWorkout,
          let index = activeWorkout.workoutRanksOrder.firstIndex(of: set.workoutRank) else {
        self.displaySetId = nil
        return
    }

    // Scan backward: Starting from index-1 of the current workoutRank
    for nextIndex in stride(from: index - 1, through: 0, by: -1) {
        let nextWorkoutRank = activeWorkout.workoutRanksOrder[nextIndex]
        
        // Check if the sets count is larger than one
        if let workoutRank = workoutRankItems[nextWorkoutRank], workoutRank.sets.count > 1 {
            self.displaySetId = workoutRankItems[nextWorkoutRank]?.sets.last?.setId
            return
        }
    }

    // If no suitable workoutRank is found, set displaySetId to nil
    self.displaySetId = nil
    
  }
  
  func nextSet(){

    // Early return if displaySetId is nil
    guard let displaySetId = self.displaySetId else { return }

    // Get the set and return early if nil
    guard let set = setService.get_set(setId: displaySetId) else {
        self.displaySetId = nil
        return
    }

    // Check if the workoutRank exists and return the next set within the workoutRank if it exists
    if let workoutRank = workoutRankItems[set.workoutRank],
       let nextSet = workoutRank.sets.first(where: { $0.exerciseRank == set.exerciseRank + 1 }) {
        self.displaySetId = nextSet.setId
        return
    }

    // Check if the active workout exists and if it is included in the current workoutRank
    guard let activeWorkout = self.activeWorkout,
          let index = activeWorkout.workoutRanksOrder.firstIndex(of: set.workoutRank) else {
        self.displaySetId = nil
        return
    }

    // Scan forward: Starting from the next index of the current workoutRank
    for nextIndex in (index + 1)..<activeWorkout.workoutRanksOrder.count {
        let nextWorkoutRank = activeWorkout.workoutRanksOrder[nextIndex]
        
        // Check if the sets count is larger than one
        if let workoutRank = workoutRankItems[nextWorkoutRank], workoutRank.sets.count > 1 {
            self.displaySetId = workoutRankItems[nextWorkoutRank]?.sets.first?.setId
            return
        }
    }

    // If no suitable workoutRank is found, set displaySetId to nil
    self.displaySetId = nil
  }
}
