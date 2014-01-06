(ns stone.entities.user
  (:use [clojure.walk   :only [keywordize-keys]])
  (:require [stone.db.mongo :as db]))

(defn users []
  [
   {:_id "zts008"  :username "zts008"  :password "123" :org "zts"  :orgName "昭通市地方税务局"}
   {:_id "ztzy008" :username "ztzy008" :password "123" :org "ztzy" :orgName "昭阳区地方税务局"}
   {:_id "ztdg008" :username "ztdg008" :password "123" :org "ztdg" :orgName "大关县地方税务局"}
   {:_id "ztyj008" :username "ztyj008" :password "123" :org "ztyj" :orgName "盐津县地方税务局"}
   {:_id "ztyl008" :username "ztyl008" :password "123" :org "ztyl" :orgName "彝良县地方税务局"}
   {:_id "ztzx008" :username "ztzx008" :password "123" :org "ztzx" :orgName "镇雄县地方税务局"}
   {:_id "ztwx008" :username "ztwx008" :password "123" :org "ztwx" :orgName "威信县地方税务局"}
   {:_id "ztld008" :username "ztld008" :password "123" :org "ztld" :orgName "鲁甸县地方税务局"}
   {:_id "ztys008" :username "ztys008" :password "123" :org "ztys" :orgName "永善县地方税务局"}
   {:_id "ztsj008" :username "ztsj008" :password "123" :org "ztsj" :orgName "绥江县地方税务局"}
   {:_id "ztsf008" :username "ztsf008" :password "123" :org "ztsf" :orgName "水富县地方税务局"}
   {:_id "ztqj008" :username "ztqj008" :password "123" :org "ztqj" :orgName "巧家县地方税务局"}
   ])

(defn login []
  (fn [ctx]
    (let [data (keywordize-keys (get-in ctx [:request :body]))
          username (:username data)
          password (:password data)]
      (first (filter #(and (= (:username %) username)
                           (= (:password %) password)) (users))
      ))))

;; (defn query-org-name [user]
;;   (-> (filter #(= (:_id %) user) (users))
;;       first
;;       :orgName))
