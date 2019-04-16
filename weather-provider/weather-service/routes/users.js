'use strict';

// const Mongoose = require('mongoose'); 
const Joi = require('joi');
const Boom = require('boom');  
const UserModel = require('../models/User');


// const UserModel = Mongoose.model("user", {
//     name: String,
//     email: String,
//     password: String 
// });

const routes = [
    {
        method: 'POST',
        path: '/api/users',
        options: {
            validate: {
                payload: {
                    name: Joi.string().min(4).max(50).required(),
                    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
                    password: Joi.string().required()
                },
                failAction: (request, h, error) => {
                    // return h.response(error, 'Internal MongoDB error').takeOver()
                    throw Boom.badRequest('Invalid request parameter found.', error);
                }
            }
        },
        handler: async (request, h) => {
            try {
                const user = new UserModel(request.payload);
                const result = await user.save();
                return h.response(result);
            } catch (error) {
                throw Boom.badImplementation('Error while creating user.', error);
                // return h.response(Boom.wrap(error, 'Internal MongoDB error')).code(500);
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
                // return h.response(Boom.wrap(error, 'Internal MongoDB error')).code(500);
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
                // return h.response(Boom.wrap(error, 'Internal MongoDB error')).code(500);
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

                    // return error.isJoi 
                    //     ? h.response(error.details[0]).takeOver()
                    //     : h.response(error).takeOver();
                }
            }
        },
        handler: async (request, h) => {
            try {
                const result = await UserModel.findByIdAndUpdate(request.params.id, request.payload, {new: true}).exec();
                return h.response(result);
            } catch (error) {
                throw Boom.badImplementation('Error while updating user.', error);
                // return h.response(Boom.wrap(error, 'Internal MongoDB error')).code(500);
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/users/{id}',
        handler: async (request, h) => {
            try {
                await UserModel.findByIdAndDelete(request.params.id).exec();
                return h.response().code(204);
            } catch (error) {
                throw Boom.badImplementation('Error while deleting user.', error);
                // return h.response(error).code(500);
            }
        }
    }];

exports.routes = server => server.route(routes);