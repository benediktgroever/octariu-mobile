//
//  Throttler.swift
//  OcatriuWatch Watch App
//
//  Created by Benedikt Groever on 1/7/24.
//
import Foundation
import Combine

import Foundation
import Dispatch

class Throttler {
    private var workItems = [String: DispatchWorkItem]()
    private let queue: DispatchQueue
    private let delay: TimeInterval

    init(delay: TimeInterval, queue: DispatchQueue = DispatchQueue.main) {
        self.delay = delay
        self.queue = queue
    }

    func throttle(uuid: String, action: @escaping () -> Void) {
        workItems[uuid]?.cancel()
        let workItem = DispatchWorkItem(block: action)
        workItems[uuid] = workItem
        queue.asyncAfter(deadline: .now() + delay, execute: workItem)
    }
}
