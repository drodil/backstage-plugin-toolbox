import { Request, Response } from 'express';

export interface ToolRequestHandler {
  getToolName(): string;
  handleRequest(request: Request<any>, response: Response): Promise<void>;
}
