
def departure_event_handler (clock):
    global Q, S, na, packetsdropped, packetssent, deps
    na = 0
    if Q > 0:
        Q -= 1
        while na < 4:
            if random() < 0.64:
                na += 1
                #schedule_event(get_next_timeout_event(clock))
            else:
                packetssent += 1
                deps.append(clock) # Record departure time
                S = True
                schedule_event(get_next_departure_event(clock))
                break
    else:
       S = False
    if na == 4:
        packetsdropped += 1
    