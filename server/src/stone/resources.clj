(ns stone.resources
  (:use [liberator.core :only [defresource resource]]
        [compojure.core :only [ANY routes]])
  (:require [stone.entities.indexes :as indexes]
            [stone.entities.user    :as user]))

(defresource indexes [id]
  :allowed-methods        [:get :post]
  :available-charsets     ["utf-8"]
  :available-media-types  ["application/json"]
  :handle-ok              (indexes/query id)
  :post!                  (indexes/create))

(defresource indexes-report []
  :allowed-methods        [:get]
  :available-charsets     ["utf-8"]
  :available-media-types  ["application/json"]
  :handle-ok         (indexes/create-report))

(defresource login []
  :allowed-methods        [:post]
  :available-charsets     ["utf-8"]
  :available-media-types  ["application/json"]
  :handle-created         (user/login)
  :post!                  (user/login))

(defn assemble-routes []
  (->
   (routes
    (ANY "/indexes/:id"    [id] (indexes id))
    (ANY "/indexes"        []   (indexes nil))
    (ANY "/indexes-report" []   (indexes-report))
    (ANY "/login"          []   (login))
    )))
