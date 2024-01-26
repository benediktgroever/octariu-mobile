//
//  OcatriuWatchApp.swift
//  OcatriuWatch Watch App
//
//  Created by Benedikt Groever on 12/3/23.
//

import SwiftUI
import WatchKit
import FirebaseCore
import FirebaseAuth


class AppDelegate: NSObject, WKApplicationDelegate {
  func applicationDidFinishLaunching() {
    FirebaseApp.configure()
  }
}

@main
struct OcatriuWatch_Watch_AppApp: App {
  @WKApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
