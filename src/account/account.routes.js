import { Router } from 'express';
import validateId from '../middleware/validateId.middleware.js';
import verifyToken from '../middleware/verifyToken.middleware.js';
import TransactionRepository from '../transaction/transaction.repository.js';
import UserRepository from '../user/user.repository.js';
import AccountController from './account.controller.js';
import AccountRepository from './account.repository.js';
import AccountService from './account.service.js';
import AccountValidator from './account.validator.js';

// * Creating dependency instances
const accountRepository = new AccountRepository();
const accountValidator = new AccountValidator();
const userRepository = new UserRepository();
const transactionRepository = new TransactionRepository();

// * Injecting dependencies
const accountService = new AccountService(
  accountRepository,
  userRepository,
  transactionRepository,
);
const accountController = new AccountController(
  accountService,
  accountValidator,
);

const router = Router();

router.post('/', verifyToken, accountController.createAccount);

router.post(
  '/:accountId/transactions',
  verifyToken,
  validateId,
  accountController.createTransaction,
);

router.get('/', verifyToken, accountController.getAccounts);

router.get('/:accountId/balance', verifyToken, accountController.getBalance);

router.get(
  '/:accountId',
  verifyToken,
  validateId,
  accountController.getAccount,
);

router.put(
  '/:accountId/pin',
  verifyToken,
  validateId,
  accountController.changeAccountPin,
);

router.patch('/transfer-funds', verifyToken, accountController.transferFunds);

router.delete(
  '/:accountId',
  verifyToken,
  validateId,
  accountController.deleteAccount,
);

export default router;
