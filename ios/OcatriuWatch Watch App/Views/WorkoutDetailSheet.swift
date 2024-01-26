//
//  WorkoutDetailSheet.swift
//  OcatriuWatch Watch App
//
//  Created by Benedikt Groever on 1/18/24.
//

import Foundation
import SwiftUI

struct RequestPermissionsView: View {
    @EnvironmentObject var heartRateService: HeartRateService
    var body: some View {
      ScrollView {
            Text("Permission Required")
                .font(.title2)
                .padding()
            Text("We need your permission to access heart rate data. This data will not be permanelty stored or analyzed in any way.")
                .font(.footnote)
                .padding()
            Button("Grant Permissions") {
                heartRateService.requestAuthorization()
            }
              .padding()
              .cornerRadius(10)
        }
    }
}

#Preview {
  RequestPermissionsView()
    .environmentObject(HeartRateService())
}
