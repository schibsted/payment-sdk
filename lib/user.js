'use strict';

/** @module user **/

/**
 * returns the currently logged in user's object.
 * @see http://techdocs.spid.no/endpoints/GET/me/
 * @param  {Api} api
 * @return {Promise}
 */
function me(api) {
    return api.get('/me');
}

/**
 * This endpoint generates an unique token (5 minutes of expiration time)
 * sent to user's e-mail, that allows user to log-in to SPiD without
 * providing his/hers credentials.
 * Only one token per user can be active at one time.
 * User doesn't have to be previously registered at SPiD.
 * You can further improve user's experience by setting context of token
 * e-mail & confirmation page by providing a Client information.
 * @see http://techdocs.spid.no/endpoints/POST/signin/
 * @param  {Api} api
 * @param  {string} identifier - user email
 * @param  {string} redirectUri - Where to redirect the user after completing
 *         signin request
 * @param  {string} [context] - an optional string (can be JSON stringified)
 *         that provides extra context to your site when the user is
 *         redirected back to your site.
 * @return {Promise} - if it's successful only a 201 status will be returned
 */
function signin(api, identifier, redirectUri = this.redirectUri, context) {
    return api.post('/api/2/signin', { identifier, redirectUri, context });
}

/**
 * Create a new user. Not available for mobile clients, for historical
 * reasons. See the signup endpoint.
 * The email is globally unique in SPiD, and there can only be one account
 * associated with any given email address. To query for the availability of
 * an email address, see the email status endpoint.
 * If a password is not provided, one will be generated by the system and
 * emailed to the user. All passwords are stored fully encrypted, thus
 * user-provided passwords can never be communicated in clear-text.
 * Only an available email address is required to create a SPiD account. The
 * additional parameters that can be provided may also be filled in by the
 * user in their SPiD profile at any later point.
 * @see http://techdocs.spid.no/endpoints/POST/user/
 * @param  {Api} api
 * @param  {object} properties
 * @return {Promise}
 */
function user(api, properties) {
    return api.post('/api/2/user', properties);
}

/**
 * Create a new user with minimal data, normally used in mobile clients.
 * The email is globally unique in SPiD, and there can only be one account
 * associated with any given email address. To query for the availability of
 * an email address, see the email status endpoint.
 * @see http://techdocs.spid.no/endpoints/POST/signup/
 * @param  {Api} api
 * @param  {string} email - Email of the user. Must be unique across all of SPiD
 * @param  {string} [password] - Desired password
 * @param  {string} [redirectUri] - Where to redirect the user after completing signup
 * @return {Promise.<User, Error>} - If successful (HTTP 201) it'll return
 *         the user object. See tech docs for more information.
 */
function signup(api, email, password, redirectUri = this.redirectUri) {
    return api.post('/api/2/signup', { email, password, redirectUri });
}

/**
 * Used to create a user when logging in via a third party (Facebook, Google).
 * This endpoint uses JWT (JSON Web Token) to transfer data.
 * @see http://techdocs.spid.no/endpoints/POST/signup_jwt/
 * @param  {Api} api
 * @param  {string} jwt - The JWT that's obtained from third party
 * @return {Promise} - HTTP 200 when successful
 */
function signupJwt(api, jwt) {
    return api.post('/api/2/signup_jwt', { jwt });
}

/**
 * Fetch an existing user by their userId (not to be mistaken by the
 * deprecated id also availble on user objects).
 * @see http://techdocs.spid.no/endpoints/GET/user/%7BuserId%7D/
 * @param  {Api} api
 * @param  {string} userId - The user's uuid or userId (not to be mistaken
 *         with the deprecated id).
 * @return {Promise} - If successful (HTTP 200) it'll return
 *         the user object. See tech docs for more information.
 */
function get(api, userId) {
    return api.get(`/api/2/user/${userId}`);
}

/**
 * Update existing user objects. Password, emails and phone numbers cannot
 * be updated through the API, the user maintains full control over those
 * through the SPiD profile UI.
 * @see http://techdocs.spid.no/endpoints/POST/user/%7BuserId%7D/
 * @param  {Api} api
 * @param  {string} userId - The user's uuid or userId (not to be mistaken
 *         with the deprecated id).
 * @param  {UserSettable} properties - the properties you wish to update
 * @return {Promise} - returns the user in case of HTTP 200
 *         otherwise an error specifiying what went wrong.
 */
function update(api, userId, properties) {
    return api.post(`/api/2/user/${userId}`, properties);
}

/**
 * Lists all users
 * @see http://techdocs.spid.no/endpoints/GET/users/
 * @param  {Api} api
 * @param  {Object} criteria
 * @param  {Object} filters
 * @return {Promise}
 */
function getAll(api, criteria, filters) {
    // TODO good idea?
    return api.get('/api/2/users', Object.assign({}, criteria, filters ));
}

/**
 * A user search that is faster and with more search options than GET /users. Normally used to
 * search for a single user.
 * @see http://techdocs.spid.no/endpoints/GET/search/users/
 * @param  {Api} api
 * @param {Object} query
 * @return {Promise}
 */
function search(api, query) {
    return api.get('/api/2/search/users', query);
}

/**
 * An alias for /search/users that sets the query parameter. Performs a full-text search for users.
 * @see http://techdocs.spid.no/endpoints/GET/search/users/%7Bquery%7D/
 * @param  {Api} api
 * @param  {string} query
 * @return {Promise}
 */
function searchFullText(api, query) {
    return api.get(`/api/2/search/users/${query}`);
}

/**
 * Trigger a new password or verify email email from SPiD to the user's
 * primary email address.
 * @see http://techdocs.spid.no/endpoints/GET/user/%7BuserId%7D/trigger/%7Btrigger%7D/
 * @param  {Api} api
 * @param  {string} userId - The user's uuid or userId (not to be mistaken
 *         with the deprecated id).
 * @param  {string} trigger - What kind of email trigger to send. Currently
 *         only two options: 'emailverification' sends an email to the user,
 *         asking them to verify their email address.
 *         'newpassword' sends an email to the user with a link to create a
 *         new password. The password reset link is valid for 24 hours.
 * @param  {string} redirectUri - Where to redirect the user after
 *         completing triggered action.
 * @return {Promise} - Returns an indication of whether or
 *         not the trigger was sent successfully
 */
function triggerVerify(api, userId, trigger, redirectUri = this.redirectUri) {
    return api.get(`/user/${userId}/trigger/${trigger}`, { redirectUri });
}

/**
 * List mail history and events for specified user.
 * @see http://techdocs.spid.no/endpoints/GET/mail/
 * @param  {Api} api
 * @param  {string} id - The user's uuid or userId (not to be mistaken with
 *         the deprecated id)
 * @param  {string} [email] - Email of the user. Must be unique across
 *         all of SPiD
 * @return {Promise<Mail[], error>}
 */
function getMailHistory(api, id, email) {
    // TODO throw if both id an email are set?
    return api.get('/mail', { id, email });
}

/**
 * Endpoint to check the verififaction level of the user. At the moment the
 * only additional level is the eID solution, which will be returned as a
 * level of 5. If a User is not verified, ie has no level above registeed
 * user, 404 error will be returned.
 * @see http://techdocs.spid.no/endpoints/GET/user/%7Bid%7D/level/
 * @param  {Api} api
 * @param  {string} userId - User ID
 * @return {Promise} - Returns a verification level and user_id
 */
function getLevel(api, userId) {
    return api.get(`/user/${userId}/level`);
}

/**
 * Check if client behind authentication token is connected to specified user.
 * @see http://techdocs.spid.no/endpoints/GET/user/%7BuserId%7D/connected/
 * @param  {Api} api
 * @param  {string} userId - The user's uuid or userId (not to be mistaken with the deprecated id).
 * @return {Promise}
 */
function isConnected(api, userId) {
    return api.get(`/user/${userId}/connected`);
}

/**
 * Lists platform and client Terms & Conditions acceptance status for specified user.
 * @see http://techdocs.spid.no/endpoints/GET/user/%7BuserId%7D/agreements/
 * @param  {Api} api
 * @param  {string} userId - The user's uuid or userId (not to be mistaken with the deprecated id).
 * @return {Promise}
 */
function getAllAgreements(api, userId) {
    return api.get(`/api/2/user/${userId}/agreements`);
}

/**
 * Accept platform and client Terms & Conditions for a specified user.
 * @see http://techdocs.spid.no/endpoints/POST/user/%7BuserId%7D/agreements/accept/
 * @param  {Api} api
 * @param  {string} userId - The user's uuid or userId (not to be mistaken with the deprecated id).
 * @return {Promise}
 */
function acceptAgreements(api, userId) {
    return api.post(`/user/${userId}/agreements/accept`);
}

module.exports = {
    me, signin, user, signup, signupJwt, get, update, getAll, search, searchFullText, triggerVerify,
    getMailHistory, getLevel, isConnected, getAllAgreements, acceptAgreements
};