'use strict';

const Boom = require('boom');  
const Joi = require('joi');
const WeatherModel = require('../models/weather');
const Authorizer = require('../auth/authorizer');

const checkLocation = async function(userId, location) {
    const weatherLocation = await WeatherModel.findOne({
        location: location,
        user: userId
    }).exec();
    if (weatherLocation) {
        throw Boom.badImplementation('Location already exists!');
    }
}

const routes = [
    {
        method: 'POST',
        path: '/api/weather',
        options: {
            validate: {
                payload: {
                    location: Joi.string().required(),
                    temperature: Joi.number().required(),
                    humidity: Joi.number().required()
                },
                failAction: (request, h, error) => {
                    throw Boom.badRequest('Invalid request parameter found.', error);
                }
            }
        },
        handler: async (request, h) => {
            try {
                const userId = await Authorizer.getUserId(request.headers.authorization);
                const weatherDto = request.payload;
                weatherDto.user = userId;
                // check if location already exists
                await checkLocation(userId, request.payload.location);
                const weather = new WeatherModel(weatherDto);
                const result = await weather.save();
                return h.response(result);
            } catch (error) {
                throw Boom.badImplementation('Error while creating weather.', error);
            }
        }
    },
    {
        method: 'GET',
        path: '/api/weather',
        handler: async (request, h) => {
            try {
                const userId = await Authorizer.getUserId(request.headers.authorization);
                const result = request.query.location 
                    ? await WeatherModel.find({
                            location: request.query.location,
                            user: userId
                        }).exec()
                    : await WeatherModel.find({user: userId}).exec();
                return h.response(result);
            } catch (error) {
                throw Boom.badImplementation('Error while fetching weather.', error);
            }
        }
    },
    {
        method: 'GET',
        path: '/api/weather/{id}',
        handler: async (request, h) => {
            try {
                const userId = await Authorizer.getUserId(request.headers.authorization);
                const result = await WeatherModel.findOne({
                    _id: request.params.id,
                    user: userId
                }).exec();
                return h.response(result);
            } catch (error) {
                throw Boom.badImplementation('Error while fetching weather.', error);
            }
        }
    },
    {
        method: 'PUT',
        path: '/api/weather/{id}',
        options: {
            validate: {
                payload: {
                    location: Joi.string().required(),
                    temperature: Joi.number().required(),
                    humidity: Joi.number().optional()
                },
                failAction: (request, h, error) => {
                    throw Boom.badRequest('Invalid request parameter found.', error);
                }
            }
        },
        handler: async (request, h) => {
            try {
                const userId = await Authorizer.getUserId(request.headers.authorization);
                // check if location already exists
                await checkLocation(request.payload.location);
                const result = await WeatherModel.findOneAndUpdate(
                    {
                        _id: request.params.id, 
                        user: userId
                    },
                    request.payload, 
                    {new: true}
                ).exec();
                return h.response(result);
            } catch (error) {
                throw Boom.badImplementation('Error while updating weather.', error);
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/weather/{id}',
        handler: async (request, h) => {
            try {
                const userId = await Authorizer.getUserId(request.headers.authorization);
                await WeatherModel.findOneAndDelete({
                    _id: request.params.id,
                    user: userId
                }).exec();
                return h.response().code(204);
            } catch (error) {
                throw Boom.badImplementation('Error while deleting weather.', error);
            }
        }
    }];
   
  exports.routes = server => server.route(routes);