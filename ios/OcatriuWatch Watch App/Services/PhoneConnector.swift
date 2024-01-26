//
//  PhoneConnector.swift
//  OcatriuWatch Watch App
//
//  Created by Benedikt Groever on 1/9/24.
//

import WatchKit
import WatchConnectivity

final class PhoneConnector: NSObject {
    var session: WCSession
    weak var delegate: DataServiceDelegate?

  
    init(session: WCSession  = .default) {
      self.session = session
      super.init()
      if WCSession.isSupported() {
          session.delegate = self
          session.activate()
      }
    }
  
    func sendMessage(response: WorkoutSetResponse) {
      do {
        let jsonData = try JSONEncoder().encode(response)
        if let message = try JSONSerialization.jsonObject(with: jsonData, options: .allowFragments) as? [String: Any] {
          self.session.sendMessage(message, replyHandler: nil) { (error) in
              print(error.localizedDescription)
          }
        }
      }catch{
        print("Error encoding or serializing data to send to iphone: \(error.localizedDescription)")
      }
    }
}

extension PhoneConnector: WCSessionDelegate {
  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
  }
  
  func session(_ session: WCSession, didReceiveMessage message: [String : Any], replyHandler: @escaping ([String : Any]) -> Void) {
    guard let messageData = message["text"] else {
        print("Data not found in message")
        return
    }

    do {
        // Convert messageData to JSON Data
        let jsonData = try JSONSerialization.data(withJSONObject: messageData)
        // Decode jsonData to WorkoutSetResponse
        let workoutResponse = try JSONDecoder().decode(WorkoutSetResponse.self, from: jsonData)
        // Now you have your workoutResponse of type WorkoutSetResponse
        // You can use it as needed
        self.delegate?.handleWorkoutSetResponse(didSendData: workoutResponse)
    } catch {
        // Handle the error if decoding fails
        print("Error decoding data: \(error.localizedDescription)")
    }
  }
}


