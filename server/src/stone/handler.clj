(ns stone.handler
  (:use [ring.middleware.json       :as    middleware]
        [stone.resources            :only  [assemble-routes]]
        ))

(def app
  (-> (assemble-routes)
      (middleware/wrap-json-body)
      (middleware/wrap-json-response)
      ))
