import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';

import {ChatService} from 'app/main/apps/chat/chat.service';

@Component({
    selector: 'app-chat-content',
    templateUrl: './chat-content.component.html'
})
export class ChatContentComponent implements OnInit {
    // Decorator
    @ViewChild('scrollMe') scrollMe: ElementRef;
    scrolltop: number = null;

    // Public
    public activeChat: Boolean;
    public chats =[
        {
            senderId:1,
            message:"hello"
        },
        {
            senderId:2,
            message:"hello there"
        }
    ];
    public chatUser={
        fullName:"ochieng Warren",
        userId:1,
        avatar:"assets/images/avatars/12-small.png",
        status:"online"
    };
    public userProfile;
    public chatMessage = '';
    public newChat;
    public startConvo:Boolean = true

    /**
     * Constructor
     *
     * @param {ChatService} _chatService
     * @param {CoreSidebarService} _coreSidebarService
     */
    constructor(private _chatService: ChatService, private _coreSidebarService: CoreSidebarService) {
    }

    // Public Methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update Chat
     */
    updateChat() {

        this.newChat = {
            message: this.chatMessage,
            time: Math.floor(Date.now()/1000),//Unix timestamp
            senderId: this.userProfile.id//Userid or username
        };
        console.log(this.chatMessage);
        console.log(this.newChat)
       // If chat data is available (update chat)
        // if (this.chats.chat) {
        //     if (this.newChat.message !== '') {
        //         this.chats.chat.push(this.newChat);
        //         this._chatService.updateChat(this.chats);
        //         this.chatMessage = '';//Reset the input to an empty value
        //         this.chats.chat.push({
        //             message: 'lol that is kind of sus',
        //             time: 'Mon Dec 10 2018 07:46:43 GMT+0000 (GMT)',
        //             senderId: 1
        //         });//Send a sample bot reply..might use this to show replies/incoming message
        //         setTimeout(() => {
        //             this.scrolltop = this.scrollMe?.nativeElement.scrollHeight;
        //         }, 0);
        //     }
       // }
        // Else create new chat
        // else {
        //    // this._chatService.createNewChat(this.chatUser.id, this.newChat);
        // }
    }

    /**
     * Toggle Sidebar
     *
     * @param name
     */
    toggleSidebar(name) {
        this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.activeChat = false
        // Subscribe to Chat Change
        // this._chatService.onChatOpenChange.subscribe(res => {
        //     this.chatMessage = '';
        //     this.activeChat = res;
        //     setTimeout(() => {
        //         this.scrolltop = this.scrollMe?.nativeElement.scrollHeight;
        //     }, 0);
        // });

        // Subscribe to Selected Chat Change
        // this._chatService.onSelectedChatChange.subscribe(res => {
        //     this.chats = res;
        // });

        // Subscribe to Selected Chat User Change
        // this._chatService.onSelectedChatUserChange.subscribe(res => {
        //     this.chatUser = res;
        // });

       // this.userProfile = this._chatService.userProfile;
    }
}
