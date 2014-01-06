(ns stone.db.mongo
  (:use [monger.operators])
  (:require [monger.core :as mg]
            [monger.collection :as mgcoll]))

(mg/connect!)
(mg/set-db! (mg/get-db "stone"))

(defn upsert [coll doc]
  (mgcoll/upsert coll {:_id (:_id doc)} doc))

(defn query-by-id [coll id]
  (mgcoll/find-map-by-id coll id))

(defn query
  ([coll] (mgcoll/find-maps coll))
  ([coll cond] (mgcoll/find-maps coll cond)))

(defn query
  ([coll] (mgcoll/find-maps coll))
  ([coll cond] (mgcoll/find-maps coll cond)))
