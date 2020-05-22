import { Service } from 'typedi';

import { knex } from 'common/db';
import { ForbiddenError } from 'common/errors/ForbiddenError';
import { UserSettingEntity } from 'common/types/entities';
import { UserSettingInput } from 'user/models';

@Service()
export class UserService {
  async validateAccessKey(accessKey: string): Promise<boolean> {
    const result = await knex('users_access_keys').where('access_key', accessKey).first();
    if (!result) {
      throw new ForbiddenError('Invalid access key');
    }
    return true;
  }

  updateUserSetting(id: string, input: UserSettingInput): Promise<UserSettingEntity> {
    return knex
      .raw(
        `
      INSERT INTO user_settings values (:userId, :name, :value)
      ON CONFLICT(user_id, name) DO UPDATE SET value = :value
      RETURNING *;
    `,
        { userId: id, ...input }
      )
      .then((result) => result.rows[0]);
  }

  getUserSettings(id: string): Promise<UserSettingEntity[]> {
    return knex<UserSettingEntity>('user_settings').where('user_id', id);
  }

  getUserSetting(id: string, name: string): Promise<UserSettingEntity> {
    return knex<UserSettingEntity>('user_settings').where('user_id', id).andWhere('name', name).first();
  }
}
