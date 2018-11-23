#!/usr/bin/env node
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const book_grpc_pb_1 = require("./book_grpc_pb");
const book_pb_1 = require("./book_pb");
const service_decorator_1 = require("../decorators/service.decorator");
const log = console.log;
let BookController = class BookController {
    getBook(call, callback) {
        const book = new book_pb_1.Book();
        book.setTitle('DefaultBook');
        book.setAuthor('DefaultAuthor');
        log(`[getBook] Done: ${JSON.stringify(book.toObject())}`);
        callback(null, book);
    }
    getBooks(call) {
        call.on('data', (request) => {
            const reply = new book_pb_1.Book();
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
    getBooksViaAuthor(call) {
        log(`[getBooksViaAuthor] Request: ${JSON.stringify(call.request.toObject())}`);
        for (let i = 1; i <= 10; i++) {
            const reply = new book_pb_1.Book();
            reply.setTitle(`Book${i}`);
            reply.setAuthor(call.request.getAuthor());
            reply.setIsbn(i);
            log(`[getBooksViaAuthor] Write: ${JSON.stringify(reply.toObject())}`);
            call.write(reply);
        }
        log('[getBooksViaAuthor] Done.');
        call.end();
    }
    getGreatestBook(call, callback) {
        let lastOne;
        call.on('data', (request) => {
            log(`[getGreatestBook] Request: ${JSON.stringify(request.toObject())}`);
            lastOne = request;
        });
        call.on('end', () => {
            const reply = new book_pb_1.Book();
            reply.setIsbn(lastOne.getIsbn());
            reply.setTitle('LastOne');
            reply.setAuthor('LastOne');
            log(`[getGreatestBook] Done: ${JSON.stringify(reply.toObject())}`);
            callback(null, reply);
        });
    }
};
BookController = __decorate([
    service_decorator_1.grpcService({ serviceDefiniton: book_grpc_pb_1.BookServiceService })
], BookController);
exports.BookController = BookController;
//# sourceMappingURL=book.controller.js.map