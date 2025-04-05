import { Request } from 'express';
import { PaginationOptions } from 'mongoose-paginate-ts';

interface PaginationOptionsExtras {
  allowedQueryFields?: string[];
  predefinedAggregates?: Record<string, any[]>;
  mode?: 'single' | 'list';
}

export function buildPaginationOptions(
  req: Request,
  config: PaginationOptionsExtras = {}
): PaginationOptions {
  const mode = config.mode || 'list';
  const options: PaginationOptions = {};

  // 🧭 Shared Options
  if (req.query.select) {
    options.select = req.query.select as string;
  }

  if (req.query.populate) {
    options.populate = req.query.populate as string;
  }

  if (req.query.projection) {
    options.projection = req.query.projection as string;
  }

  if (req.query.lean) {
    options.lean = req.query.lean === 'true';
  }

  if (req.query.key) {
    options.key = req.query.key as string;
  }

  // 📄 List-specific Pagination Fields
  if (mode === 'list') {
    if (req.query.page) {
      options.page = parseInt(req.query.page as string, 10);
    }

    if (req.query.limit) {
      options.limit = parseInt(req.query.limit as string, 10);
    }

    if (req.query.sort) {
      options.sort = req.query.sort as string;
    }

    if (req.query.startingAfter) {
      options.startingAfter = req.query.startingAfter;
    }

    if (req.query.endingBefore) {
      options.endingBefore = req.query.endingBefore;
    }
  }

  // 🔐 Safe Query Filtering — allowed in both modes
  if (config.allowedQueryFields && req.query.query) {
    try {
      const parsedQuery = JSON.parse(req.query.query as string);
      options.query = Object.fromEntries(
        Object.entries(parsedQuery).filter(([key]) =>
          config.allowedQueryFields!.includes(key)
        )
      );
    } catch {
      throw new Error('Invalid query JSON string');
    }
  }

  // 🔐 Safe Aggregation — allowed in both modes
  if (config.predefinedAggregates && req.query.aggregate) {
    const requestedAggregate = req.query.aggregate as string;
    if (config.predefinedAggregates[requestedAggregate]) {
      options.aggregate = config.predefinedAggregates[requestedAggregate];
    } else {
      throw new Error(`Invalid aggregate: ${requestedAggregate}`);
    }
  }

  return options;
}

