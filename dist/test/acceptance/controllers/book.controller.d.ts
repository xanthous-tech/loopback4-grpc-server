#!/usr/bin/env node
import * as grpc from 'grpc';
import { Book, GetBookRequest, GetBookViaAuthor } from './book_pb';
export declare class BookController {
    getBook(request: GetBookRequest): Promise<Book>;
    getBooks(call: grpc.ServerDuplexStream<GetBookRequest, Book>): void;
    getBooksViaAuthor(call: grpc.ServerWriteableStream<GetBookViaAuthor>): void;
    getGreatestBook(call: grpc.ServerReadableStream<GetBookRequest>): Promise<Book>;
}
