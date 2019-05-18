'use strict';

const Joi = require('joi');
const Boom = require('boom');  
const UserModel = require('../models/user');
const Authorizer = require('../auth/authorizer');

const hasPermission = async function(request) {
    const userId = await Authorizer.getUserId(request.headers.authorization);
    if (request.params.id !== userId) {
        throw Boom.badRequest('Operation not permitted!');
    }
}

const routes = [
    {
        method: 'POST',
        path: '/api/users',
        options: {
            auth: false,
            validate: {
                payload: {
                    name: Joi.string().min(4).max(50).required(),
                    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
                    password: Joi.string().required()
                },
                failAction: (request, h, error) => {
                    throw Boom.badRequest('Invalid request parameter found.', error);
                }
            }
        },
        handler: async (request, h) => {
            try {
                const existing = await UserModel.findOne({
                    email: request.payload.email
                }).exec();

                if (existing) {
                    throw Boom.badImplementation('Email address already exists! Cannot create user.');    
                }

                const user = new UserModel(request.payload);
                const result = await user.save();
                return h.response(result);
            } catch (error) {
                throw Boom.badImplementation('Error while creating user.', error);
            }
        }
    },
    {
        method: 'GET',
        path: '/api/users',
        handler: async (request, h) => {
            try {
                const result = await UserModel.find().exec();
                return h.response(result);
            } catch (error) {
                throw Boom.badImplementation('Error while fetching users.', error);
            }
        }
    },
    {
        method: 'GET',
        path: '/api/users/{id}',
        handler: async (request, h) => {
            try {
                const result = await UserModel.findById(request.params.id).exec();
                return h.response(result);
            } catch (error) {
                throw Boom.badImplementation('Error while fetching user.', error);
            }
        }
    },
    {
        method: 'PUT',
        path: '/api/users/{id}',
        options: {
            validate: {
                payload: {
                    name: Joi.string().optional(),
                    email: Joi.string().optional(),
                    password: Joi.string().optional()
                },
                failAction: (request, h, error) => {
                    throw Boom.badRequest('Invalid request parameter found.', error);
                }
            }
        },
        handler: async (request, h) => {
            try {
                await hasPermission(request);
                const result = await UserModel.findByIdAndUpdate(request.params.id, request.payload, {new: true}).exec();
                return h.response(result);
            } catch (error) {
                throw Boom.badImplementation('Error while updating user.', error);
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/users/{id}',
        handler: async (request, h) => {
            try {
                await hasPermission(request);
                await UserModel.findByIdAndDelete(request.params.id).exec();
                return h.response().code(204);
            } catch (error) {
                throw Boom.badImplementation('Error while deleting user.', error);
            }
        }
    }];

exports.routes = server => server.route(routes);