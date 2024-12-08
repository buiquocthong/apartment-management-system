package vn.apartment.master.interactor.block;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.block.BlockDTO;
import vn.apartment.master.mapper.BlockMapper;
import vn.apartment.master.service.BlockService;

import java.util.List;
import java.util.stream.Collectors;

@Interactor
public class ListBlock {

    @Autowired
    private BlockService blockService;

    @Autowired
    private BlockMapper blockMapper;

    @Transactional(readOnly = true)
    public List<BlockDTO> execute() {
        return blockService.findAll()
                .stream().map(blockMapper::toDto)
                .collect(Collectors.toList());
    }
}
