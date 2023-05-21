import { Model } from 'objection';
import { v4 as uuidv4 } from 'uuid';
import AccountRepository from '../account/account.repository.js';
import DuplicateError from '../errors/duplicate.error.js';
import { uuidToBin } from '../utils/uuidConverter.utils.js';
import UserModel from './user.model.js';
import UserRepository from './user.repository.js';

const userRepository = new UserRepository();
const accountRepository = new AccountRepository();

class UserService {
  /**
   * Create a new user and account.
   * @param {SignUpDto} signUpDto
   * @returns {Promise<UserProfile>}
   */
  async signUp(signUpDto) {
    const newUserUuid = uuidv4();
    const newAccountUuid = uuidv4();

    return await Model.transaction(async (trx) => {
      const [newUser] = await Promise.all([
        userRepository.insert(signUpDto, trx),
        accountRepository.insert(signUpDto.account),
      ]);

      newUser.toObject();

      /**@type {UserProfile} */
      return newUser;
    });
  }

  async getUsers(queryObj) {
    const foundUsers = await UserRepository.findAll(queryObj);
    const count = Intl.NumberFormat('en-US').format(foundUsers.length);

    // Modify array inplace to delete user passwords.
    foundUsers.forEach((user) => user.omitPassword());

    return { count, foundUsers };
  }

  async getUser(userId) {
    const foundUser = await UserRepository.findById(userId);
    foundUser.omitPassword();

    return foundUser;
  }

  async updateUser(currentUser, updateUserDto) {
    const updatedUser = await UserRepository.update(currentUser, updateUserDto);
    updatedUser.omitPassword();

    return updatedUser;
  }

  async deleteUser(currentUser, userId) {
    if (currentUser.id == userId) {
      const [{ count }] = await UserModel.query()
        .where({ role: user })
        .count({ count: 'id' });

      if (count > 0)
        throw new DuplicateError('Conflict! Admin user must be the only user.');
    }
    // @TODO: invalidate access token...
    // possible solution is to implement refresh tokens with short lived access tokens.
    return await UserRepository.delete(userId);
  }
}

export default UserService;
