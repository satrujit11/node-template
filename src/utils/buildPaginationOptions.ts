import { Request } from 'express';
import { PaginationOptions } from 'mongoose-paginate-ts';

export function buildPaginationOptions(req: Request): PaginationOptions {
  const options: PaginationOptions = {
    page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
    limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
    sort: req.query.sort as string,
    key: req.query.key as string,
    query: req.query.query ? JSON.parse(req.query.query as string) : undefined,
    select: req.query.select as string,
    populate: req.query.populate as string,
    projection: req.query.projection as string,
    // Add more fields as needed
  };


  if (req.query.page) {
    options.page = parseInt(req.query.page as string, 10);
  }

  if (req.query.limit) {
    options.limit = parseInt(req.query.limit as string, 10);
  }

  if (req.query.sort) {
    options.sort = req.query.sort;
  }

  if (req.query.query) {
    try {
      options.query = JSON.parse(req.query.query as string);
    } catch (err) {
      throw new Error('Invalid query JSON string');
    }
  }

  if (req.query.populate) {
    options.populate = req.query.populate;
  }

  if (req.query.select) {
    options.select = req.query.select;
  }

  if (req.query.projection) {
    options.projection = req.query.projection;
  }

  if (req.query.aggregate) {
    try {
      options.aggregate = JSON.parse(req.query.aggregate as string);
    } catch (err) {
      throw new Error('Invalid aggregate JSON string');
    }
  }

  if (req.query.lean) {
    options.lean = req.query.lean === 'true';
  }

  if (req.query.key) {
    options.key = req.query.key as string;
  }

  if (req.query.startingAfter) {
    options.startingAfter = req.query.startingAfter;
  }

  if (req.query.endingBefore) {
    options.endingBefore = req.query.endingBefore;
  }

  return options;
}

