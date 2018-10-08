import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PageEvent, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: 'First Post', content: 'This is the first post's content' },
  //   { title: 'Second Post', content: 'This is the second post's content' },
  //   { title: 'Third Post', content: 'This is the third post's content' }
  // ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private postsSub: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      // this if block with terniary operator is not in the instructors code : )
      if (this.totalPosts - 1 - (this.postsPerPage * (this.currentPage - 1)) <= 0) {
        this.currentPage = (this.currentPage === 1) ? 1 : this.currentPage - 1;
        this.paginator.pageIndex = this.currentPage - 1;
        this.totalPosts = (this.totalPosts === 0) ? 0 : this.totalPosts - 1;
        this.paginator.page.next({
          pageIndex: this.paginator.pageIndex,
          pageSize: this.paginator.pageSize,
          length: this.totalPosts
        });
      } else {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      }
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
