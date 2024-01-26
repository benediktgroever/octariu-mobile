//
//  HeartRateService.swift
//  OcatriuWatch Watch App
//
//  Created by Benedikt Groever on 1/17/24.
//

import Foundation
import HealthKit

class HeartRateService: ObservableObject {
    private var healthStore: HKHealthStore?
    private let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate)!
    @Published var authorizationStatus: HKAuthorizationStatus = .notDetermined
    @Published var lastHeartRate: Double = 0.0

    init() {
      if let healthStore = self.healthStore, HKHealthStore.isHealthDataAvailable() {
          self.authorizationStatus = healthStore.authorizationStatus(for: heartRateType)
      } else {
          self.authorizationStatus = .sharingDenied
      }
    }

    // Modify the requestAuthorization function to update the authorizationStatus
    func requestAuthorization() {
        guard let healthStore = self.healthStore else { return }
        healthStore.requestAuthorization(toShare: [], read: [heartRateType]) { (success, error) in
            // Check the current authorization status after the request is completed
            let currentStatus = healthStore.authorizationStatus(for: self.heartRateType)
            DispatchQueue.main.async {
                self.authorizationStatus = currentStatus
            }
        }
    }

    func fetchLatestHeartRate() {
        guard let healthStore = self.healthStore else { return }
        
        let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)

        let query = HKSampleQuery(sampleType: heartRateType, predicate: nil, limit: 1, sortDescriptors: [sortDescriptor]) { [weak self] (_, results, error) in
            guard let self = self, let samples = results as? [HKQuantitySample], let sample = samples.first else {
                // Handle any errors here.
                return
            }
            
            DispatchQueue.main.async {
                self.lastHeartRate = sample.quantity.doubleValue(for: HKUnit(from: "count/min"))
            }
        }

        healthStore.execute(query)
    }
}
