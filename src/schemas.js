/**
 * Created by prashun on 9/22/16.
 */
import { Schema } from 'mongoose';

module.exports = {
    permission : {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        devices: [{
            type: String
        }],
        applications: [{
            type: String
        }],
        api_white_list: {
            type: Schema.Types.Mixed,
            required: true
        }
    },
    role : {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        claims: {
            type: Schema.Types.ObjectId,
            required: true
        }
    },
    token: {
        userId: {
            type: String,
            required: true
        },
        accessToken: {
            type: String,
            required: true
        }
    },
    user: {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            default: 'some.user@example.com'
        },
        roles: {
            type: [String],
            required: true
        },
        hashedPassword: {
            type: String,
            required: true
        },
        salt: {
            type: String,
            required: false,
            default: 'saltAndPeppa'
        }
    }
}