
Slim Javascript Elasticsearch Client
====================================
Pure Javascript Client to have a super basic access and make basic Elasticsearch queries.

TODO
====
Combinare
    {
            "size":2,
        "query": {
            "fuzzy": {
               "_all": "huawai"
            }
        }
    }

con

    "query": {
        "bool": {
            "must": [
            	{"match": {"type": "AutoValue_Comment"}},
   				{"bool": {"should": [
                	{"match": {"tags": "worldnews"}}
				]}},
                {"exists": {"field": "type"}}
            ]
        }
    }

