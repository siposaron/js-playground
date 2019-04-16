'use strict';

const Boom = require('boom');  
const Joi = require('joi');
const UserModel = require('../models/User');

const routes = [{
    method: 'POST',
    path: '/api/token',
    options: {
        validate: {
            payload: {
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
            const user = await UserModel.findOne({
                email: request.payload.email
            }).exec();

            if (user) {
                // GENERATE JWT token
                const result = {};
                result.token = "TOKEN" + user.id + user.email + user.name;
                return h.response(result);
            }

            throw Boom.badRequest('User not found.');

        } catch (error) {
            throw Boom.badImplementation('Error while creating token.', error);
        }
    }
  }];
   
  exports.routes = server => server.route(routes);