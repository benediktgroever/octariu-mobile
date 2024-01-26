//
//  WorkoutSelection.swift
//  OcatriuWatch Watch App
//
//  Created by Benedikt Groever on 12/3/23.
//

import SwiftUI

struct WorkoutSelectionView: View {
  @EnvironmentObject var data_service: DataService
  var body: some View {
      NavigationSplitView {
        List(data_service.templates){ template in
          Button(action: {
            data_service.workoutService.create_active_workout_from_template(
              template: template.workout
            )
          }) {
            WorkoutSelectionListItemView(template: template)
          }
        }
        .navigationTitle("Workouts")
      } detail: {
        Text("Select your workout")
      }
    }
}

struct WorkoutSelectionListItemView: View {
  var template: WorkoutTemplateViewItem
  var body: some View {
    return VStack(alignment: .leading) {
      HStack {
        Text(template.workout.name)
          .font(.headline)
          .foregroundColor(.gray)
        Spacer()
      }
      Text("\(self.timeAgoSinceDate(template.lastEndTimeMs))")
        .font(.footnote)
          .foregroundColor(.gray)
      }
    .padding()
  }
  private func timeAgoSinceDate(_ lastEndTimeMs: Int) -> String {
    let date = Date(timeIntervalSince1970: TimeInterval(lastEndTimeMs)/1000.0)
    let calendar = Calendar.current
    let now = Date()
    let components = calendar.dateComponents([.year, .month, .weekOfYear, .day, .hour, .minute, .second], from: date, to: now)
    if let year = components.year, year >= 2 {
        return "\(year) years ago"
    } else if let year = components.year, year >= 1 {
        return "a year ago"
    } else if let month = components.month, month >= 2 {
        return "\(month) months ago"
    } else if let month = components.month, month >= 1 {
        return "a month ago"
    } else if let week = components.weekOfYear, week >= 2 {
        return "\(week) weeks ago"
    } else if let week = components.weekOfYear, week >= 1 {
        return "a week ago"
    } else if let day = components.day, day >= 2 {
        return "\(day) days ago"
    } else if let day = components.day, day >= 1 {
        return "Yesterday"
    } else if let hour = components.hour, hour >= 2 {
        return "\(hour) hours ago"
    } else if let hour = components.hour, hour >= 1 {
        return "an hour ago"
    } else if let minute = components.minute, minute >= 2 {
        return "\(minute) minutes ago"
    } else if let minute = components.minute, minute >= 1 {
        return "a minute ago"
    } else {
        return "Just now"
    }
  }
}

#Preview {
  WorkoutSelectionView()
    .environmentObject(DataService())
}
