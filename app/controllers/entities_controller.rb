class EntitiesController < ApplicationController
  before_action :set_entity, only: [:show, :edit, :update, :destroy]
  before_action :check_changed_attributes, only: [ :update ]

  respond_to :html

  def index
    @entities = Entity.all_by_user(current_user.id)
    respond_with(@entities)
  end

  def show
    respond_with(@entity)
  end

  def new
    @entity = Entity.new
    respond_with(@entity)
  end

  def edit
  end

  def create
    @entity = Entity.new(entity_params)
    @entity.user=current_user
    @entity.save
    respond_with(@entity)
  end

  def update
    @entity.user=current_user
    @entity.update(entity_params)
    respond_with(@entity)
  end

  def destroy
    @entity.destroy
    respond_with(@entity)
  end

  def show_password
    render :json => Entity.show_password(params[:master_password],params[:entity_id],current_user).to_json
  end

  private

    def set_entity
      @entity = Entity.find(params[:id])
    end

    def entity_params
      params.require(:entity).permit!
    end

    def check_changed_attributes
      @entity.check_changed_attributes(entity_params.keys)
    end
end
