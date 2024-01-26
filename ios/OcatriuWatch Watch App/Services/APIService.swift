//
//  APIService.swift
//  OcatriuWatch Watch App
//
//  Created by Benedikt Groever on 12/5/23.
//

import Foundation

class APIService {
  let baseURL: String
  
  init(endpoint: String) {
    self.baseURL = "http://127.0.0.1:8080" + endpoint
  }
  
  func make_api_call(endpoint: String, method: String, params: [AnyHashable: Any]) async throws -> Data?{

    var urlComponents = URLComponents(string: self.baseURL + endpoint)
    var queryItems = [URLQueryItem]()
    
    // Add params to url
    for (key, value) in params {
      let keyString = String(describing: key)
      let valueString = String(describing: value)
      queryItems.append(URLQueryItem(name: keyString, value: valueString))
    }
    urlComponents?.queryItems = queryItems
   
    // Check if url is valid
    guard let url = urlComponents?.url else {
      print("The URL is nil")
      return nil
    }
    
    // Add headers to request
    var request = URLRequest(url: url)
    request.httpMethod = method
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    
    // Transmit request via URLSession
    // Use URLSession and await the response
    let (data, _) = try await URLSession.shared.data(for: request)
    
    return data
    
  }
}
