(ns stone.entities.indexes
  (:use [clojure.walk :only [keywordize-keys]]
        [clojure.algo.generic.functor :only [fmap]])
  (:require [stone.db.mongo :as db]
            [clj-time.core :as time :only [today]]))

(defn create []
  (fn [ctx]
    (let [data (keywordize-keys (get-in ctx [:request :body]))
          doc (assoc data
                :submitDate (str (time/today)))]
      (db/upsert "indexes" doc))))

(defn query [id]
  (if (nil? id)
    (reduce concat
            (map (fn [x]
                   (map #(into % {:orgName (:orgName x)}) (:data x)))
                 (db/query "indexes")))
    (:data (db/query-by-id "indexes" id))))

(defn- float2 [f]
  (read-string (format "%.2f" (double f))))


(defn create-report []
  (map (fn [x]
         (reduce (fn [y z] (merge-with #(if (number? %1) (float2 (+ %1 %2)) %1) y z))
                 x))
       (map #(second %)
            (group-by :date
                      (query nil)))))
