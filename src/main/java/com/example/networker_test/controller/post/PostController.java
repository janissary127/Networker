package com.example.networker_test.controller.post;

import java.util.List;

import com.example.networker_test.domain.post.Post;
import com.example.networker_test.domain.post.PostForm;
import com.example.networker_test.service.post.PostService;

import jakarta.validation.Valid;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;


import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/post")
@RequiredArgsConstructor
public class PostController {

	private final PostService postService;//의존성 주입
	
	@GetMapping("/list")//게시물 리스트 페이지 연결
	public String list(Model model) {
        List<Post> postList = this.postService.getList();
        model.addAttribute("postList", postList);
        return "board";
    }
	
	@GetMapping(value="/detail/{id}")//특정 게시물의 페이지 연결
	public String detail(Model model, @PathVariable("id") Integer id) {
    	Post post = this.postService.getPost(id);
    	model.addAttribute("post", post);
    	return "post";
	}
	
	@GetMapping("/create")//게시물 등록 요청 페이지 연결
    public String postCreate(PostForm postForm) {
    return "createpost";
    }
	
	@PostMapping("/create")//게시물 등록 처리
	public String postCreate(@Valid PostForm postForm, BindingResult bindingResult) {
		if(bindingResult.hasErrors()) {
			return "createpost";
		}
		this.postService.create(postForm.getSubject(), postForm.getContent());//blank input prevention
    	return "redirect:/post/list";//저장 후 목록으로
	}
}
