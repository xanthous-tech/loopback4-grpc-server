#!/usr/bin/env node
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = require("grpc");
const book_grpc_pb_1 = require("./book_grpc_pb");
const book_pb_1 = require("./book_pb");
const grpc_decorator_1 = require("../../../src/decorators/grpc.decorator");
const log = console.log;
let BookController = class BookController {
    async getBook(request) {
        const book = new book_pb_1.Book();
        book.setTitle('DefaultBook');
        book.setAuthor('DefaultAuthor');
        log(`[getBook] Done: ${JSON.stringify(book.toObject())}`);
        return book;
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
    async getGreatestBook(call) {
        return new Promise(resolve => {
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
                resolve(reply);
            });
        });
    }
};
__decorate([
    grpc_decorator_1.grpcServiceMethod({
        methodDefinition: book_grpc_pb_1.BookServiceService.getBook,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [book_pb_1.GetBookRequest]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "getBook", null);
__decorate([
    grpc_decorator_1.grpcServiceMethod({
        methodDefinition: book_grpc_pb_1.BookServiceService.getBooks,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [grpc.ServerDuplexStream]),
    __metadata("design:returntype", void 0)
], BookController.prototype, "getBooks", null);
__decorate([
    grpc_decorator_1.grpcServiceMethod({
        methodDefinition: book_grpc_pb_1.BookServiceService.getBooksViaAuthor,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [grpc.ServerWriteableStream]),
    __metadata("design:returntype", void 0)
], BookController.prototype, "getBooksViaAuthor", null);
__decorate([
    grpc_decorator_1.grpcServiceMethod({
        methodDefinition: book_grpc_pb_1.BookServiceService.getGreatestBook,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [grpc.ServerReadableStream]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "getGreatestBook", null);
BookController = __decorate([
    grpc_decorator_1.grpcService({
        serviceDefiniton: book_grpc_pb_1.BookServiceService,
    })
], BookController);
exports.BookController = BookController;
//# sourceMappingURL=book.controller.js.map