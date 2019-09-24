package de.viadee.bpmnai.ui.backend.service;

import com.google.gson.Gson;
import de.viadee.bpmnai.ui.backend.Application;
import de.viadee.bpmnai.ui.backend.service.websocket.WebSocketMessage;
import io.javalin.websocket.WsConnectContext;

public class WebsocketService {

    private static WebsocketService instance;

    public static synchronized WebsocketService getInstance(){
        if(instance == null){
            instance = new WebsocketService();
        }
        return instance;
    }

    public void broadcastMessage(boolean jobRunning, boolean jobFinished, boolean jobResultOK, String jobName, boolean handleMessage, String message) {
        WebSocketMessage webSocketMessage = new WebSocketMessage();
        webSocketMessage.setJobRunning(jobRunning);
        webSocketMessage.setHandleMessage(handleMessage);
        webSocketMessage.setMessage(message);
        webSocketMessage.setJobName(jobName);
        webSocketMessage.setJobFinished(jobFinished);
        webSocketMessage.setJobResultOK(jobResultOK);
        for (WsConnectContext wscc : Application.wsSessionMap.keySet()) {
            if (wscc.session.isOpen()) {
                wscc.send(new Gson().toJson(webSocketMessage));
            }
        }
    }

    public void broadcastMessage(boolean jobRunning, boolean handleMessage, String message) {
        broadcastMessage(jobRunning, false, true, "", handleMessage, message);
    }
}
