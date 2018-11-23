#!/usr/bin/env node

import * as grpc from 'grpc';

import {BookServiceService, IBookServiceServer} from './book_grpc_pb';
import {Book, GetBookRequest, GetBookViaAuthor} from './book_pb';
import {grpcService} from '../decorators/service.decorator';

const log = console.log;

@grpcService({serviceDefiniton: BookServiceService})
export class BookController implements IBookServiceServer {
  getBook(
    call: grpc.ServerUnaryCall<GetBookRequest>,
    callback: grpc.sendUnaryData<Book>,
  ) {
    const book = new Book();

    book.setTitle('DefaultBook');
    book.setAuthor('DefaultAuthor');

    log(`[getBook] Done: ${JSON.stringify(book.toObject())}`);
    callback(null, book);
  }

  getBooks(call: grpc.ServerDuplexStream<GetBookRequest, Book>) {
    call.on('data', (request: GetBookRequest) => {
      const reply = new Book();
      reply.setTitle(`Book${request.getIsbn()}`);
      reply.setAuthor(`Author${request.getIsbn()}`);
      reply.setIsbn(request.getIsbn());
      log(`[getBooks] Write: ${JSON.stringify(reply.toObject())}`);
      call.write(reply);
    });
    call.on('end', () => {
      log('[getBooks] Done.');
      call.end();
    });
  }

  getBooksViaAuthor(call: grpc.ServerWriteableStream<GetBookViaAuthor>) {
    log(
      `[getBooksViaAuthor] Request: ${JSON.stringify(call.request.toObject())}`,
    );
    for (let i = 1; i <= 10; i++) {
      const reply = new Book();
      reply.setTitle(`Book${i}`);
      reply.setAuthor(call.request.getAuthor());
      reply.setIsbn(i);
      log(`[getBooksViaAuthor] Write: ${JSON.stringify(reply.toObject())}`);
      call.write(reply);
    }
    log('[getBooksViaAuthor] Done.');
    call.end();
  }

  getGreatestBook(
    call: grpc.ServerReadableStream<GetBookRequest>,
    callback: grpc.sendUnaryData<Book>,
  ) {
    let lastOne: GetBookRequest;
    call.on('data', (request: GetBookRequest) => {
      log(`[getGreatestBook] Request: ${JSON.stringify(request.toObject())}`);
      lastOne = request;
    });
    call.on('end', () => {
      const reply = new Book();
      reply.setIsbn(lastOne.getIsbn());
      reply.setTitle('LastOne');
      reply.setAuthor('LastOne');
      log(`[getGreatestBook] Done: ${JSON.stringify(reply.toObject())}`);
      callback(null, reply);
    });
  }
}
