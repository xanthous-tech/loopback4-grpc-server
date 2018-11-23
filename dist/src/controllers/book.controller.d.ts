#!/usr/bin/env node
import * as grpc from 'grpc';
import { IBookServiceServer } from './book_grpc_pb';
import { Book, GetBookRequest, GetBookViaAuthor } from './book_pb';
export declare class BookController implements IBookServiceServer {
    getBook(call: grpc.ServerUnaryCall<GetBookRequest>, callback: grpc.sendUnaryData<Book>): void;
    getBooks(call: grpc.ServerDuplexStream<GetBookRequest, Book>): void;
    getBooksViaAuthor(call: grpc.ServerWriteableStream<GetBookViaAuthor>): void;
    getGreatestBook(call: grpc.ServerReadableStream<GetBookRequest>, callback: grpc.sendUnaryData<Book>): void;
}
