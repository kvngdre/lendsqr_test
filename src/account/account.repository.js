import objection from 'objection';
import DuplicateError from '../errors/duplicate.error.js';
import ValidationException from '../errors/validation.error.js';
import getDuplicateField from '../utils/getDuplicateField.utils.js';
import Account from './account.model.js';

class AccountRepository {
  /**
   * Inserts a new account into the database.
   * @param {CreateAccountDto} createAccountDto
   * @param {objection.Transaction} [trx] - Knex transaction object.
   * @returns {Promise<Account>} A promise that resolves with the inserted Account object, or rejects with an error if the insertion fails.
   * @throws {DuplicateError} If a unique constraint violation occurs on any of the account properties.
   * @throws {Error} If any other error occurs during the insertion.
   */
  async insert(createAccountDto, trx) {
    try {
      return Account.query(trx).insert(createAccountDto);
    } catch (exception) {
      if (exception instanceof objection.UniqueViolationError) {
        throw new DuplicateError(
          `Account with user id ${createAccountDto.user_id} already exists.`,
        );
      }

      throw exception;
    }
  }

  /**
   *
   * @param {AccountFilter} filter
   * @returns
   */
  async find(filter) {
    return Account.query()
      .modify('filterBalance', filter)
      .modify('omitFields', 'pin')
      .orderBy('created_at', 'desc');
  }

  /**
   * Retrieve an account by id.
   * @param {string} id - The account id
   * @returns {Promise<Account|undefined>} A promise that resolves to the account object or undefined if not found.
   */
  async findById(id) {
    return Account.query().findById(id);
  }

  /**
   * Retrieves an account by filter object.
   * @param {UserFilter} filter - An object with user profile fields to filter by (optional).
   * @returns {Promise<Account|undefined>} A promise that resolves with the User object if found, or undefined if not found. Rejects if any error occurs.
   */
  async findByFilter(filter) {
    return Account.query().where(filter).first();
  }

  /**
   *
   * @param {string} accountId - The account id
   * @param {UpdateAccountDto} updateAccountDto
   * @param {objection.Transaction} [trx] - Knex transaction object.
   * @returns {Promise<Account>}
   * @throws {NotFoundError} If account cannot be found.
   */
  async update(accountId, updateAccountDto, trx) {
    try {
      const foundAccount = await Account.query().findById(accountId);
      if (!foundAccount) {
        throw new NotFoundError('Operation failed. Account not found.');
      }

      return await Account.query(trx).patch(updateAccountDto);
    } catch (exception) {
      if (exception instanceof UniqueViolationError) {
        const key = getDuplicateField(exception);
        throw new DuplicateError(`${key} already in use.`);
      }

      throw exception;
    }
  }

  async delete(accountId, message = 'Account not found') {
    const numberOfDeletedRows = await Account.query()
      .deleteById(accountId)
      .throwIfNotFound(message);

    return numberOfDeletedRows;
  }
}

export default AccountRepository;
