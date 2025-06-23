import { injectable } from 'tsyringe';
import { z } from 'zod';
import { IWebAppParser } from '../interfaces/IWebAppParser';
import { WebAppDataContext } from '../models/context.model';

const UserProfileSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

type UserProfile = z.infer<typeof UserProfileSchema>;

// Demo parser, paxi use in the same way
@injectable()
export class UserProfileParser implements IWebAppParser<UserProfile> {
  public readonly dataType = 'user_profile_update';

  public async parseAndHandle(ctx: WebAppDataContext, data: UserProfile): Promise<void> {
    const validationResult = UserProfileSchema.safeParse(data);

    if (!validationResult.success) {
      await ctx.reply('Received profile data was invalid. Please try again.');
      console.error(validationResult.error);
      return;
    }

    const { name, email } = validationResult.data;

    await ctx.reply(`Thanks, ${name}! Your profile has been updated with the email: ${email}`);
  }
}