class Entity
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  field :name, type: String
  field :username, type: String
  field :description, type: String
  field :url, type: String
  field :password, type: String
  belongs_to :user

  attr_accessor :master_password

  #Callback
  before_save :crypt_password
  #Scope
  scope :all_by_user, -> (user_id) { where(:user_id => user_id).order(name: :asc) }
  scope :find_by_and_user, -> (user_id) { where(:user_id => user_id) }

  #Crypt Password with Master password
  def crypt_password 
    if !master_password
      raise "Master Password not valid"
    end
    puts "Crypting user password with master password ..."
    self.password = AESCrypt.encrypt(password, master_password)
  end

  #Delete removed custom attributes
  def check_changed_attributes(keys)
    (self.attributes.keys - keys - ["_id", "user_id"]).each do |key|
      delete_custom_attributes(key.to_s.to_sym)
    end
  end

  #Retunr custom attributes keys
  def custom_attributes
    (self.attributes.keys-self.attribute_names).map { |x| x.to_sym }
  end

  #Delete custom attributes
  def delete_custom_attributes(key)
    self.unset(key.to_s.to_sym)
  end

  #Decrypt and show password
  def self.show_password(master_password,entity_id,current_user)
  	entity = Entity.find(:id=> entity_id,:user_id=>current_user.id)
  	if !entity
  		raise "Entity not found"
  	end
  	AESCrypt.decrypt(entity.password, master_password)
  end

end
