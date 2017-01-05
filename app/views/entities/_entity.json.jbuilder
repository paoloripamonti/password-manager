json.extract! entity, :id, :name, :description, :url, :password, :created_at, :updated_at
json.url entity_url(entity, format: :json)