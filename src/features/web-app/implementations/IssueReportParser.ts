import { injectable } from 'tsyringe';
import { z } from 'zod';
import { IWebAppParser } from '../interfaces/IWebAppParser';
import { ParserContext } from '../models/parser-context.model';

const IssueReportSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty.'),
  description: z.string().min(1, 'Description cannot be empty.'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  category: z.enum(['bug', 'feature', 'improvement', 'question']),
});

type IssueReportData = z.infer<typeof IssueReportSchema>;

@injectable()
export class IssueReportParser implements IWebAppParser<IssueReportData> {
  public readonly dataType = 'add_issue';

  public async parseAndHandle(ctx: ParserContext, data: IssueReportData): Promise<void> {
    const validation = IssueReportSchema.safeParse(data);
    if (!validation.success) {
      await ctx.reply('The issue report data was invalid. Please try again.');
      console.error(validation.error.flatten().fieldErrors);
      return;
    }

    const { title, priority, category } = validation.data;
    
    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
    const formattedPriority = priority.charAt(0).toUpperCase() + priority.slice(1);
    
    const replyText = 
      `✅ **Issue Reported Successfully!**\n\n` +
      `Thank you for submitting a *${formattedCategory}* report.\n\n` +
      `**Title:** _${title}_\n` +
      `**Priority:** ${formattedPriority}\n\n` +
      `Our team will look into it soon.`;

    await ctx.reply(replyText, { parse_mode: 'Markdown' });
  }
}