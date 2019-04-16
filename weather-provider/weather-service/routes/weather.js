'use strict';

const Boom = require('boom');  
const Joi = require('joi');
const WeatherModel = require('../models/Weather');

const routes = [
    {
        method: 'POST',
        path: '/api/weather',
        options: {
            validate: {
                payload: {
                    user: Joi.string().required(),
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
                const weather = new WeatherModel(request.payload);
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
                const result = request.query.location 
                    ? await WeatherModel.find({
                            location: request.query.location
                        }).exec()
                    : await WeatherModel.find().exec();
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
                const result = await WeatherModel.findById(request.params.id).exec();
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
                const result = await WeatherModel.findByIdAndUpdate(request.params.id, request.payload, {new: true}).exec();
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
                await WeatherModel.findByIdAndDelete(request.params.id).exec();
                return h.response().code(204);
            } catch (error) {
                throw Boom.badImplementation('Error while deleting weather.', error);
            }
        }
    }];
   
  exports.routes = server => server.route(routes);